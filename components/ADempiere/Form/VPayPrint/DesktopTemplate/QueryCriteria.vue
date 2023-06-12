<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-form
    :inline="true"
    label-position="top"
    class="form-min-label"
  >
    <el-col :span="24">
      <el-form-item
        :label="$t('VPayPrint.paymentSelection')"
      >
        <el-select
          v-model="storedCurrentPaymentSelectionId"
          filterable
          @visible-change="loadPaymentSelectionsList"
          @change="changePaymentSelection"
        >
          <el-option
            v-for="item in storedPaymentSelectionsList"
            :key="item.id"
            :label="item.displayedValue"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item
        :label="$t('VPayPrint.paymentRule')"
      >
        <el-select
          v-model="storedCurrentPaymentRuleId"
          :disabled="isReadOnly"
          filterable
          @visible-change="loadPaymentRulesList"
        >
          <el-option
            v-for="(item, key) in storedPaymentRulesList"
            :key="key"
            :label="`${item.displayedValue} (${item.value})`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item
        :label="$t('VPayPrint.nextSequence')"
      >
        <el-input
          v-model="documentNumberSequence"
          :disabled="isReadOnly"
        />
      </el-form-item>
    </el-col>
  </el-form>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

// Components and Mixins
import useCriteria from '@theme/components/ADempiere/Form/VPayPrint/useCriteria.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'QueryCriteria',

  setup() {
    const {
      storedCurrentPaymentSelectionId,
      storedPaymentSelectionsList,
      storedPaymentRulesList,
      storedCurrentPaymentRuleId,
      isReadOnly,
      getPaymentsSelectionsListFromServer,
      changePaymentSelection,
      getPaymentRulesListFromServer
    } = useCriteria()

    // Values Left Pane Search Filter
    const documentNumberSequence = ref('')
    const currentBalance = ref('')

    function loadPaymentSelectionsList(isExpandList) {
      if (!isExpandList) {
        return
      }

      if (!isEmptyValue(storedPaymentSelectionsList.value)) {
        return
      }

      getPaymentsSelectionsListFromServer({})
    }

    function loadPaymentRulesList(isExpandList) {
      if (!isExpandList) {
        return
      }

      if (!isEmptyValue(storedPaymentRulesList.value)) {
        return
      }

      getPaymentRulesListFromServer()
    }

    return {
      storedCurrentPaymentSelectionId,
      storedPaymentSelectionsList,
      storedCurrentPaymentRuleId,
      storedPaymentRulesList,
      isReadOnly,
      currentBalance,
      documentNumberSequence,
      loadPaymentSelectionsList,
      changePaymentSelection,
      loadPaymentRulesList
    }
  }
})
</script>
