<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <div style="display: flex">
    <!-- Left Pane Search Filter -->
    <div class="panel-left-search-filter" style="width: 50%;">
      <el-card shadow="always" style="padding: 10px !important;height: 100%;">
        <query-criteria />
      </el-card>
    </div>

    <!-- Right panel -->
    <div class="right-panel-top-panel-labels" style="width: 50%;">
      <el-card shadow="always" style="padding: 10px !important;">
        <payment-selection />
      </el-card>
    </div>

    <!-- Payment List Table -->
    <!-- <results /> -->
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// Components and Mixins
import PaymentSelection from '@theme/components/ADempiere/Form/VPayPrint/DesktopTemplate/PaymentSelection.vue'
import QueryCriteria from '@theme/components/ADempiere/Form/VPayPrint/DesktopTemplate/QueryCriteria.vue'

export default defineComponent({
  name: 'DesktopTemplate',

  components: {
    PaymentSelection,
    QueryCriteria
  },

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  setup() {
  }
})
</script>
