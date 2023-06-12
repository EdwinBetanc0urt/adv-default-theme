<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <el-row style="padding-top: 25px;padding-left: 10px;padding-right: 10px;">
    <div v-if="!isMobile">
      <div style="display: flex">
        <!-- Left Pane Search Filter -->
        <div class="panel-left-search-filter" style="width: 50%;">
          <el-card shadow="always" style="padding: 10px !important;height: 100%;">
            <query-criteria />
            <!-- <el-form
              :inline="true"
              label-position="top"
            >
              <el-col :span="24">
                <el-form-item
                  :label="$t('VPayPrint.paymentSelection')"
                >
                  <el-select
                    v-model="currentPaymentSelection"
                    filterable
                    @visible-change="findListPaymentSelection"
                    @change="setPaymentSelection"
                  >
                    <el-option
                      v-for="item in listPayment"
                      :key="item.KeyColumn"
                      :label="item.DisplayColumn"
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
                    v-show="!isEmptyValue(currentPaymentSelection)"
                    v-model="paymentRule"
                    filterable
                    @visible-change="findListPaymentRueles"
                  >
                    <el-option
                      v-for="(item, key) in listPaymentRules"
                      :key="key"
                      :label="item.displayColumn"
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
                    v-show="!isEmptyValue(currentBalance)"
                    v-model="documentNumberSequence"
                  />
                </el-form-item>
              </el-col>
            </el-form> -->
          </el-card>
        </div>
        <!-- Right panel -->
        <div class="right-panel-top-panel-labels" style="width: 50%;">
          <el-card shadow="always" style="padding: 10px !important;">
            <!-- Top Panel Labels / E Payment Selection Information -->
            <el-row>
              <el-form
                :inline="true"
                label-position="top"
              >
                <el-col :span="24">
                  <el-form-item
                    label="Banco"
                    style="margin-bottom: 0px;"
                  >
                    <b style="font-size: 18px;"> {{ currentBank }} </b>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('VPayPrint.bankAccount')"
                    style="margin-bottom: 0px;"
                  >
                    <b style="font-size: 18px;"> {{ currentBankAccount }} </b>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('VPayPrint.currentBalance')"
                    style="margin-bottom: 0px;"
                  >
                    <b v-show="!isEmptyValue(currentBankAccount)" style="font-size: 18px;"> {{ formatPrice({ value: currentBalance, currency}) }} </b>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <!-- Bottom Panel Button Panel / Form Options -->
            <el-row>
              <el-col :span="24">
                <el-card shadow="never" style="padding: 10px !important;">
                  <div slot="header" class="clearfix" style="text-align: center;">
                    <b> {{ $t('VPayPrint.buttons.labelPanel') }} </b>
                  </div>
                  <div style="text-align: center;padding-top: 20px;">
                    <!-- Process Print Payment -->
                    <el-popover
                      ref="printProcess"
                      :title="'¿' + $t('VPayPrint.message.printMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('printProcess')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('printProcess')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="info"
                        :loading="isLoadPrint"
                        :disabled="(isLoadPrint || isEmptyValue(dataLot))"
                        style="margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadPrint">
                          <i class="el-icon-printer" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.print') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                    <!-- Process Export Payment -->
                    <el-popover
                      ref="exportProcess"
                      :title="'¿' + $t('VPayPrint.message.ExportMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('exportProcess')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('exportProcess')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="primary"
                        :loading="isLoadExport"
                        :disabled="(isLoadExport || isEmptyValue(dataLot))"
                        style="margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadExport">
                          <i class="el-icon-download" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.toExport') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                    <!-- Process on Line -->
                    <el-popover
                      ref="processOnLine"
                      :title="'¿' + $t('VPayPrint.message.processMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('processOnLine')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('processOnLine')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="success"
                        :loading="isLoadProcess"
                        :disabled="(isLoadProcess || isEmptyValue(dataLot))"
                        style="margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadProcess">
                          <i class="el-icon-s-tools" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.processOnLine') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
      <!-- Payment List Table -->
      <div>
        <el-table
          :data="dataLot"
          style="width: 100%"
        >
          <el-table-column :label="$t('VPayPrint.headerTable.title')">
            <index-column
              :page-number="dataLot.length"
            />
            <el-table-column
              v-for="(head, key) in headerTable"
              :key="key"
              :prop="head.columnName"
              :label="head.label"
              :align="head.align"
            >
              <template slot-scope="scope">
                <span v-if="head.align === 'right'">
                  {{ formatQuantity({ value: scope.row[head.columnName] }) }}
                </span>
                <span v-else>
                  {{ scope.row[head.columnName] }}
                </span>
                <!-- {{ scope.row[head.columnName] }} -->
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- Mode Mobile -->
    <div v-else :style="styleMobile">
      <div style="overflow: auto;">
        <!-- Left Pane Search Filter -->
        <div>
          <el-card shadow="always" style="padding: 10px !important;height: 100%;">
            <el-form
              :inline="true"
              label-position="top"
              class="demo-form-inline"
            >
              <el-col :span="24">
                <el-form-item
                  :label="$t('VPayPrint.paymentSelection')"
                >
                  <el-select
                    v-model="currentPaymentSelection"
                    filterable
                    @visible-change="findListPaymentSelection"
                    @change="setPaymentSelection"
                  >
                    <el-option
                      v-for="item in listPayment"
                      :key="item.KeyColumn"
                      :label="item.DisplayColumn"
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
                    v-show="!isEmptyValue(currentPaymentSelection)"
                    v-model="paymentRule"
                    filterable
                    @visible-change="findListPaymentRueles"
                  >
                    <el-option
                      v-for="(item, key) in listPaymentRules"
                      :key="key"
                      :label="item.displayColumn"
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
                    v-show="!isEmptyValue(currentBalance)"
                    v-model="documentNumberSequence"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-card>
        </div>
        <!-- Right panel -->
        <div>
          <el-card shadow="always" style="padding: 10px !important;">
            <!-- Top Panel Labels / E Payment Selection Information -->
            <el-row>
              <el-form
                :inline="true"
                label-position="top"
                class="demo-form-inline"
              >
                <el-col :span="24">
                  <el-form-item
                    label="Banco"
                    style="margin-bottom: 0px;"
                  >
                    <b style="font-size: 18px;"> {{ currentBank }} </b>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('VPayPrint.bankAccount')"
                    style="margin-bottom: 0px;"
                  >
                    <b style="font-size: 18px;"> {{ currentBankAccount }} </b>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('VPayPrint.currentBalance')"
                    style="margin-bottom: 0px;"
                  >
                    <b v-show="!isEmptyValue(currentBankAccount)" style="font-size: 18px;"> {{ formatPrice({ value: currentBalance, currency}) }} </b>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <!-- Bottom Panel Button Panel / Form Options -->
            <el-row>
              <el-col :span="24">
                <el-card shadow="never" style="padding: 10px !important;">
                  <div slot="header" class="clearfix" style="text-align: center;">
                    <b> {{ $t('VPayPrint.buttons.labelPanel') }} </b>
                  </div>
                  <div style="padding-top: 20px;text-align: center;float: right;width: 100%;">
                    <!-- Process Print Payment -->
                    <el-popover
                      ref="printProcess"
                      :title="'¿' + $t('VPayPrint.message.printMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('printProcess')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('printProcess')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="info"
                        :loading="isLoadPrint"
                        :disabled="(isLoadPrint || isEmptyValue(dataLot))"
                        style="padding: 10px; margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadPrint">
                          <i class="el-icon-printer" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.print') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                    <!-- Process Export Payment -->
                    <el-popover
                      ref="exportProcess"
                      :title="'¿' + $t('VPayPrint.message.ExportMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('exportProcess')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('exportProcess')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="primary"
                        :loading="isLoadExport"
                        :disabled="(isLoadExport || isEmptyValue(dataLot))"
                        style="padding: 10px; margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadExport">
                          <i class="el-icon-download" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.toExport') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                    <!-- Process on Line -->
                    <el-popover
                      ref="processOnLine"
                      :title="'¿' + $t('VPayPrint.message.processMessage') + actionMessageProcessOnLine + '?'"
                      placement="top"
                      trigger="click"
                    >
                      <el-button
                        style="float:right;margin-left: 10px;"
                        type="primary"
                        icon="el-icon-check"
                        @click="checkProcess('processOnLine')"
                      />
                      <el-button
                        style="float: right;"
                        type="danger"
                        icon="el-icon-close"
                        @click="closeProcess('processOnLine')"
                      />
                      <el-button
                        slot="reference"
                        plain
                        type="success"
                        :loading="isLoadProcess"
                        :disabled="(isLoadProcess || isEmptyValue(dataLot))"
                        style="padding: 10px; margin: 0px 5px 0px 5px;"
                      >
                        <span v-show="!isLoadProcess">
                          <i class="el-icon-s-tools" />
                          <br>
                          <b> {{ $t('VPayPrint.buttons.processOnLine') }} </b>
                        </span>
                      </el-button>
                    </el-popover>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
      <!-- Payment List Table -->
      <div>
        <el-table
          :data="dataLot"
          style="width: 100%"
        >
          <el-table-column :label="$t('VPayPrint.headerTable.title')">
            <index-column
              :page-number="dataLot.length"
            />
            <el-table-column
              v-for="(head, key) in headerTable"
              :key="key"
              :prop="head.columnName"
              :label="head.label"
              :align="head.align"
              min-width="120px"
            >
              <template slot-scope="scope">
                <span v-if="head.align === 'right'">
                  {{ formatQuantity({ value: scope.row[head.columnName] }) }}
                </span>
                <span v-else>
                  {{ scope.row[head.columnName] }}
                </span>
                <!-- {{ scope.row[head.columnName] }} -->
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-row>
</template>

<script>
import { defineComponent, ref, computed, watch } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Constants
import { HEADER_TABLE } from '@theme/components/ADempiere/Form/VPayPrint/paymentTable.js'

// Components and Mixins
import IndexColumn from '@theme/components/ADempiere/DataTable/Components/IndexColumn.vue'
import QueryCriteria from '@theme/components/ADempiere/Form/VPayPrint/QueryCriteria.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import {
  formatQuantity,
  formatPrice
} from '@/utils/ADempiere/formatValue/numberFormat'

// API Request Methods
import {
  // Set
  paymentSelection,
  // List
  paymentSelections,
  paymentRules,
  // Table
  listPaymentTable,
  // Documemnt No Sequence
  documentSequence,
  // Button Panel Processes
  print,
  exportPayment,
  process
} from '@/api/ADempiere/form/VPayPrint.js'

export default defineComponent({
  name: 'VPayPrint',

  components: {
    IndexColumn,
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

  setup(props, { refs }) {
    const headerTable = HEADER_TABLE

    /**
     * Refs
     *  # Values Left Pane Search Filter
     *     - Values(currentPaymentSelection, paymentRule, documentNumberSequence)
     *     └──> @param {string} currentPaymentSelection - Selection of Current Payment
     *     └──> @param {string} documentNumberSequence - Document Number Sequence Value
     *     └──> @param {string} paymentRule - Current Payment Rule of the Current Payment Selection
     *     - List Option Select
     *     └──> @param {array} listPaymentRules - List of Payment Rule of the Current Payment Selection
     *     └──> @param {array} listPayment - List of Available Payment Selection
     *  # Values Right Panel
     *     - Top Panel Labels / E Payment Selection Information
     *     └──> @param {string} currentBankAccount - Current Payment Selection Bank Account
     *     └──> @param {string} currentBalance - Current Balance of Current Payment Selection
     *     └──> @param {string} currentBank - Current Bank of Current Payment Selection
     *     └──> @param {string} currency - Current currency of Current Payment Selection
     *     └──> @param {string} currentBankAccountId - Current Bank ID of Current Payment Selection
     *  # Bottom Panel Button Panel / Form Options
     *      - Component Loading Flags Button
     *      └──> @param {boolean} isLoadPrint - Loading the Print Line Process Execution
     *      └──> @param {boolean} isLoadExport - Loading Line Export Process Execution
     *      └──> @param {boolean} isLoadProcess - Loading the Process Execution of the Process Process Process to Process in Line
     *  # Payment List Table
     *      └──> @param {array} dataLot - List Record Lot
     */

    // Values Left Pane Search Filter
    const currentPaymentSelection = ref('')
    const paymentRule = ref('')
    const documentNumberSequence = ref('')

    // List Option Select -> (Left Pane Search Filter)
    const listPaymentRules = ref([])
    const listPayment = ref([])

    // Values Right Panel Info
    const currentBankAccount = ref('')
    const currentBalance = ref('')
    const currentBank = ref('')
    const currency = ref('')
    const currentBankAccountId = ref(0)

    // isLoand Bottom
    const isLoadPrint = ref(false)
    const isLoadExport = ref(false)
    const isLoadProcess = ref(false)

    // Table
    const dataLot = ref([])

    // isModal
    const wantProcessTransfer = ref(false)

    // Refs Popover
    const processOnLine = ref()
    const printProcess = ref()
    const exportProcess = ref()

    /**
     * Computed
     *  @param {boolean} isMobile - Detect a mobile device
     *  @param {string} styleMobile - Change the style depending on a device
     */
    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })
    const styleMobile = computed(() => {
      if (isMobile.value) return 'overflow: auto;height: 83%;'
      return ''
    })

    const actionMessageProcessOnLine = computed(() => {
      if (isEmptyValue(paymentRule.value)) return ''
      const typeRule = listPaymentRules.value.find(rule => rule.id === paymentRule.value)
      return paymentRuleTranslation(typeRule)
    })

    /**
     * Methods
     */

    // Set Values  (Payment Select and Document No)
    function setPaymentSelection(payment) {
      if (isEmptyValue(payment)) {
        return
      }
      paymentSelection({
        id: payment
      })
        .then(response => {
          listPaymentRules.value = []
          const bankAccount = response.bank_account
          if (isEmptyValue(bankAccount)) {
            showMessage({
              message: 'error',
              type: 'error'
            })
            return
          }
          currentBankAccount.value = bankAccount.account_no
          currentBalance.value = bankAccount.current_balance
          currentBank.value = bankAccount.bank_name
          currentBankAccountId.value = bankAccount.id
          currency.value = response.currency.iso_code
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    function setDocument({
      paymentSelectionId,
      paymentRuleId,
      banckAccountId
    }) {
      documentSequence({
        paymentSelectionId,
        paymentRuleId,
        banckAccountId
      })
        .then(response => {
          documentNumberSequence.value = response.document_no
        })
    }

    // List Option Select (List Payment Selection and List Payment Rules)
    function findListPaymentRueles(isfindRules) {
      if (!isfindRules) return
      paymentRules({
        paymentSelectionId: currentPaymentSelection.value
      })
        .then(response => {
          const { records } = response
          listPaymentRules.value = records.map(rulesPay => {
            return {
              ...rulesPay,
              displayColumn: rulesPay.values.DisplayColumn,
              keyColumn: rulesPay.values.KeyColumn
            }
          })
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    function findListPaymentSelection(isFind) {
      if (!isFind) {
        return
      }
      paymentSelections()
        .then(response => {
          const { records } = response
          listPayment.value = records.map(selectionPay => {
            return {
              ...selectionPay.values,
              id: selectionPay.values.KeyColumn,
              uuid: selectionPay.values.UUID
            }
          })
        })
        .catch(error => {
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    // Find List Record in Table
    function listTable({
      paymentSelectionId,
      paymentRuleId
    }) {
      listPaymentTable({
        paymentSelectionId,
        paymentRuleId
      })
        .then(responseTable => {
          dataLot.value = responseTable.records
        })
    }

    // Bottom Panel Button Panel / Form Options (Process Payment Selecction And PrintPayment And toExport)
    function processPayment() {
      isLoadProcess.value = true
      process({
        paymentSelectionId: currentPaymentSelection.value,
        paymentRuleId: paymentRule.value,
        documentNo: documentNumberSequence.value
      })
        .then(response => {
          isLoadProcess.value = false
          wantProcessTransfer.value = false
          showMessage({
            message: 'OK',
            type: 'success'
          })
        })
        .catch(error => {
          isLoadProcess.value = false
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    function printPayment() {
      isLoadPrint.value = true
      print({
        paymentSelectionId: currentPaymentSelection.value,
        paymentRuleId: paymentRule.value,
        documentNo: documentNumberSequence.value
      })
        .then(response => {
          isLoadPrint.value = false
          showMessage({
            message: 'OK',
            type: 'success'
          })
        })
        .catch(error => {
          isLoadPrint.value = false
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    function toExport() {
      isLoadExport.value = true
      exportPayment({
        paymentSelectionId: currentPaymentSelection.value,
        paymentRuleId: paymentRule.value,
        documentNo: documentNumberSequence.value
      })
        .then(response => {
          isLoadExport.value = false
          showMessage({
            message: 'OK',
            type: 'success'
          })
        })
        .catch(error => {
          isLoadExport.value = false
          showMessage({
            message: error,
            type: 'error'
          })
        })
    }

    // Get Payment Rule Translation

    function paymentRuleTranslation(payment) {
      const { values } = payment
      let message
      switch (values.ValueColumn) {
        case 'P':
          message = lang.t('VPayPrint.message.paymentRule.onCredit')
          break
        case 'S':
          message = lang.t('VPayPrint.message.paymentRule.check')
          break
        case 'T':
          message = lang.t('VPayPrint.message.paymentRule.directDeposit')
          break
        case 'D':
          message = lang.t('VPayPrint.message.paymentRule.directDebit')
          break
        case 'K':
          message = lang.t('VPayPrint.message.paymentRule.creditCard')
          break
      }
      return message
    }

    function checkProcess(namePopover) {
      if (namePopover === 'processOnLine') {
        processPayment()
      } else if (namePopover === 'printProcess') {
        printPayment()
      } else if (namePopover === 'exportProcess') {
        toExport()
      }
      closeProcess(namePopover)
    }

    function closeProcess(namePopover) {
      refs[namePopover].showPopper = false
    }

    /**
     * Watch
     */
    watch(currentPaymentSelection, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue !== oldValue) {
        listTable({
          paymentSelectionId: newValue,
          paymentRuleId: paymentRule.value
        })
        setDocument({
          paymentSelectionId: newValue,
          paymentRuleId: paymentRule.value
        })
      }
    })

    watch(paymentRule, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue !== oldValue) {
        listTable({
          paymentSelectionId: currentPaymentSelection.value,
          paymentRuleId: newValue,
          banckAccountId: currentBankAccountId.value
        })
        setDocument({
          paymentSelectionId: currentPaymentSelection.value,
          paymentRuleId: newValue,
          banckAccountId: currentBankAccountId.value
        })
      }
    })

    return {
      // Const
      headerTable,
      // Refs
      currentPaymentSelection,
      listPayment,
      currentBankAccount,
      currentBalance,
      currentBank,
      paymentRule,
      listPaymentRules,
      currentBankAccountId,
      documentNumberSequence,
      currency,
      dataLot,
      // Refs --> flag that will indicate if you are loading the process button. (isLoadPrint, isLoadExport, isLoadProcess)
      isLoadPrint,
      isLoadExport,
      isLoadProcess,
      // Refs --> related to message dialog and behavior. (actionMessageProcessOnLine, processOnLine, printProcess, exportProcess)
      actionMessageProcessOnLine,
      processOnLine,
      printProcess,
      exportProcess,
      // Computed
      isMobile,
      styleMobile,
      // Methods
      findListPaymentSelection,
      findListPaymentRueles,
      setPaymentSelection,
      listTable,
      setDocument,
      processPayment,
      toExport,
      printPayment,
      formatQuantity,
      formatPrice,
      paymentRuleTranslation,
      checkProcess,
      closeProcess
    }
  }
})
</script>

<style lang="scss">
.panel-left-search-filter {
  .el-form--label-top .el-form-item__label {
    float: none;
    display: inline-block;
    text-align: left;
    padding: 0px;
  }
}
.right-panel-top-panel-labels {
  .el-form--label-top .el-form-item__label {
    float: none;
    display: inline-block;
    text-align: left;
    padding: 0px;
  }
}
</style>
