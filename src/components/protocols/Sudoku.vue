<template>
  <v-card>
    <v-card-subtitle v-if="direction != 'out_json'">
      Sudoku
    </v-card-subtitle>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-text-field
          v-model="data.key"
          :label="$t('types.sudoku.key')"
          hide-details
          :hint="$t('types.sudoku.keyHint')"
          persistent-hint
          :append-inner-icon="direction == 'in' ? 'mdi-refresh' : undefined"
          @click:append-inner="generateKey"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-select
          v-model="data.aead"
          hide-details
          :label="$t('types.sudoku.aead')"
          :items="aeads"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-select
          v-model="data.ascii"
          hide-details
          :label="$t('types.sudoku.ascii')"
          :items="asciis"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-text-field
          v-model.number="data.padding_min"
          :label="$t('types.sudoku.paddingMin')"
          type="number"
          min="0"
          max="100"
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-text-field
          v-model.number="data.padding_max"
          :label="$t('types.sudoku.paddingMax')"
          type="number"
          min="0"
          max="100"
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-text-field
          v-model="data.custom_table"
          :label="$t('types.sudoku.customTable')"
          hide-details
          clearable
          @click:clear="delete data.custom_table"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-select
          v-model="data.multiplex"
          hide-details
          :label="$t('types.sudoku.multiplex')"
          :items="multiplexes"
          clearable
          @click:clear="delete data.multiplex"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-switch
          v-model="data.enable_pure_downlink"
          color="primary"
          :label="$t('types.sudoku.pureDownlink')"
          hide-details
        />
      </v-col>
    </v-row>
    <!-- httpmask is only meaningful on a real inbound/outbound, not on the
         client out_json block. -->
    <v-row v-if="direction != 'out_json'">
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-select
          v-model="httpmask.mode"
          hide-details
          :label="$t('types.sudoku.httpmask')"
          :items="httpmaskModes"
          clearable
          @click:clear="delete httpmask.mode"
        />
      </v-col>
      <v-col
        v-if="direction == 'out'"
        cols="12"
        sm="6"
        md="4"
      >
        <v-text-field
          v-model="httpmask.host"
          :label="$t('types.sudoku.httpmaskHost')"
          hide-details
          clearable
          @click:clear="delete httpmask.host"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-text-field
          v-model="httpmask.path_root"
          :label="$t('types.sudoku.httpmaskPathRoot')"
          hide-details
          clearable
          @click:clear="delete httpmask.path_root"
        />
      </v-col>
    </v-row>
    <v-row v-if="direction == 'in'">
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-text-field
          v-model.number="data.handshake_timeout"
          :label="$t('types.sudoku.handshakeTimeout')"
          type="number"
          min="0"
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-select
          v-model="data.suspicious_action"
          hide-details
          :label="$t('types.sudoku.suspiciousAction')"
          :items="suspiciousActions"
          clearable
          @click:clear="delete data.suspicious_action"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-text-field
          v-model="data.fallback_address"
          :label="$t('types.sudoku.fallbackAddress')"
          hide-details
          clearable
          @click:clear="delete data.fallback_address"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { Inbound } from '@/types/inbounds'
import { Outbound } from '@/types/outbounds'
import HttpUtils from '@/plugins/httputil'

// One form serves the inbound, the outbound and the client out_json block; the
// field names are identical across all three, so the shape is shared.
interface SudokuData {
  key?: string
  aead?: string
  ascii?: string
  custom_table?: string
  padding_min?: number
  padding_max?: number
  enable_pure_downlink?: boolean
  multiplex?: string
  handshake_timeout?: number
  suspicious_action?: string
  fallback_address?: string
  httpmask?: {
    disable?: boolean
    mode?: string
    tls?: boolean
    host?: string
    path_root?: string
    multiplex?: string
  }
}

// The parent owns the object and this component edits it in place, so it is a
// model rather than a plain prop.
const model = defineModel<Inbound | Outbound>('data', { required: true })

const data = computed(() => model.value as unknown as SudokuData)

const props = defineProps<{
  direction: 'in' | 'out' | 'out_json'
}>()

// Ensure the nested httpmask object exists before the form binds to it. Done
// in an effect rather than inside the computed: writing to a dependency from a
// computed getter can re-trigger the getter.
watchEffect(() => {
  if (!data.value.httpmask) data.value.httpmask = {}
})

const httpmask = computed(() => data.value.httpmask ?? {})

const aeads = [
  { title: 'ChaCha20-Poly1305', value: 'chacha20-poly1305' },
  { title: 'AES-128-GCM', value: 'aes-128-gcm' },
  { title: 'None (testing only)', value: 'none' },
]

const asciis = [
  { title: 'Prefer ASCII', value: 'prefer_ascii' },
  { title: 'Prefer Entropy', value: 'prefer_entropy' },
]

const multiplexes = [
  { title: 'Off', value: 'off' },
  { title: 'Auto', value: 'auto' },
]

const httpmaskModes = [
  { title: 'Auto', value: 'auto' },
  { title: 'Legacy', value: 'legacy' },
  { title: 'WebSocket', value: 'ws' },
]

const suspiciousActions = [
  { title: 'Fallback', value: 'fallback' },
  { title: 'Silent', value: 'silent' },
]

// The core's own generator, so the key format always matches. The pair is
// asymmetric: the server (this inbound) keeps the public key and the client
// gets the private key, which is the half the sudoku handshake expects. Putting
// the private key on the inbound made the two sides derive different tables and
// every connection died with EOF.
async function generateKey() {
  const msg = await HttpUtils.get<string[]>('api/keypairs', { k: 'sudoku' })
  if (msg.success && Array.isArray(msg.obj) && msg.obj.length >= 2 && props.direction == 'in') {
    const [privateKey, publicKey] = msg.obj
    data.value.key = publicKey
    const out = (data.value as { out_json?: { key?: string } }).out_json
    if (out) out.key = privateKey
  }
}
</script>
