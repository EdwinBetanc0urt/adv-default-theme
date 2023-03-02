/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { computed } from '@vue/composition-api'

import store from '@/store'

// Constants
import { DEFAULT_REPORT_TYPE } from '@/utils/ADempiere/dictionary/report'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default ({
  containerUuid
}) => {
  // const storedReportDefinition = computed(() => {
  //   return store.getters.getStoredReport(containerUuid)
  // })

  const currentReportGenerated = computed(() => {
    return store.getters.getReportGenerated(containerUuid)
  })

  const reportFormatTypesList = computed(() => {
    return store.getters.getStoredReportExportTypes(containerUuid)
  })

  const currentReportType = computed({
    get() {
      let reportType = DEFAULT_REPORT_TYPE
      const storedReportGenerated = currentReportGenerated.value
      if (!isEmptyValue(storedReportGenerated)) {
        if (!isEmptyValue(storedReportGenerated.reportType)) {
          reportType = storedReportGenerated.reportType
        }
      }
      return reportType
    },
    set(newValue) {
      store.commit('setReportGenerated', {
        containerUuid,
        reportViewUuid: currentReportViewUuid.value,
        printFormatUuid: currentPrintFormatUuid.value,
        reportType: newValue
      })
    }
  })

  const reportViewsList = computed(() => {
    return store.getters.getReportViewList(containerUuid)
  })

  const defaultReportView = computed(() => {
    return store.getters.getDefaultReportView(containerUuid)
  })

  const currentReportViewUuid = computed({
    get() {
      const storedReportGenerated = currentReportGenerated.value
      if (!isEmptyValue(storedReportGenerated)) {
        if (!isEmptyValue(storedReportGenerated.reportViewUuid)) {
          return storedReportGenerated.reportViewUuid
        }
      }
      return defaultReportView.value.reportViewUuid
    },
    set(newValue) {
      store.commit('setReportGenerated', {
        containerUuid,
        reportViewUuid: newValue,
        printFormatUuid: currentPrintFormatUuid.value,
        reportType: currentReportType.value
      })
    }
  })

  const reportPrintFormatsList = computed(() => {
    return store.getters.getPrintFormatList(containerUuid)
  })

  const defaulPrintFormat = computed(() => {
    return store.getters.getDefaultPrintFormat(containerUuid)
  })

  const currentPrintFormatUuid = computed({
    get() {
      const storedReportGenerated = currentReportGenerated.value
      if (!isEmptyValue(storedReportGenerated)) {
        if (!isEmptyValue(storedReportGenerated.printFormatUuid)) {
          return storedReportGenerated.printFormatUuid
        }
      }
      return defaulPrintFormat.value.printFormatUuid
    },
    set(newValue) {
      store.commit('setReportGenerated', {
        containerUuid,
        reportViewUuid: currentReportViewUuid.value,
        printFormatUuid: newValue,
        reportType: currentReportType.value
      })
    }
  })

  return {
    reportFormatTypesList,
    currentReportType,
    reportPrintFormatsList,
    defaulPrintFormat,
    currentPrintFormatUuid,
    reportViewsList,
    defaultReportView,
    currentReportViewUuid
  }
}
