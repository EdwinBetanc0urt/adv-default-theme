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
import {
  DISPLAY_COLUMN_PREFIX,
  UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
} from '@/utils/ADempiere/dictionaryUtils'
import { WAREHOUSE } from '@/utils/ADempiere/constants/systemColumns'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils'

export default ({
  parentUuid,
  containerUuid,
  containerManager,
  fieldAttributes
}) => {
  const blankValues = computed(() => {
    return {
      [fieldAttributes.columnName]: undefined,
      [fieldAttributes.elementName]: undefined,
      [DISPLAY_COLUMN_PREFIX + fieldAttributes.columnName]: undefined,
      [DISPLAY_COLUMN_PREFIX + fieldAttributes.elementName]: undefined,
      id: undefined,
      uuid: undefined,
      UUID: undefined,
      value: undefined
    }
  })

  const uuidForm = computed(() => {
    if (!isEmptyValue(fieldAttributes.containerUuid)) {
      return fieldAttributes.columnName + '_' + containerUuid
    }
    return fieldAttributes.columnName
  })

  const warehouseId = computed(() => {
    return store.getters.getValueOfField({
      parentUuid,
      containerUuid,
      columnName: WAREHOUSE
    })
  })

  const isShowedPopover = computed({
    get() {
      return store.getters.getWarehouseLocatorShow({
        containerUuid: uuidForm.value
      })
    },
    set(newValue) {
      store.commit('setWarehouseLocatorShow', {
        containerUuid: uuidForm.value,
        isShowed: newValue
      })
    }
  })

  const contextAttributesList = computed(() => {
    if (!isEmptyValue(fieldAttributes.reference) && !isEmptyValue(fieldAttributes.reference.contextColumnNames)) {
      return getContextAttributes({
        parentUuid,
        containerUuid,
        contextColumnNames: fieldAttributes.reference.contextColumnNames,
        keyName: 'key'
      })
    }
    return []
  })

  function close(row) {
    // store.commit('setShowProductAttribute', false)
    isShowedPopover.value = false
  }

  function clearValues() {
    setValues(
      blankValues.value
    )

    store.dispatch('clearValuesOnContainer', {
      containerUuid: uuidForm.value
    })
  }

  function setValues(row) {
    const { id, uuid, value } = row

    // const { parentUuid, containerUuid } = fieldAttributes

    const columnName = fieldAttributes.columnName

    store.commit('updateValueOfField', {
      parentUuid,
      containerUuid,
      columnName,
      value: id
    })
    // set display column (name) value
    store.commit('updateValueOfField', {
      parentUuid,
      containerUuid,
      // DisplayColumn_'ColumnName'
      columnName: DISPLAY_COLUMN_PREFIX + columnName,
      value: value
    })
    // set UUID value
    store.commit('updateValueOfField', {
      parentUuid,
      containerUuid,
      columnName: columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
      value: uuid
    })
    // update element column name
    if (fieldAttributes.isSameColumnElement) {
      store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: fieldAttributes.elementName,
        value: id
      })
      // set display column (name) value
      store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: DISPLAY_COLUMN_PREFIX + fieldAttributes.elementName,
        value: value
      })
    }

    // implement container manager row
    if (fieldAttributes.inTable && containerManager && containerManager.setCell) {
      containerManager.setCell({
        containerUuid,
        rowIndex: fieldAttributes.rowIndex,
        columnName,
        value: id
      })
      containerManager.setCell({
        containerUuid,
        rowIndex: fieldAttributes.rowIndex,
        columnName: DISPLAY_COLUMN_PREFIX + columnName,
        value: value
      })
    }

    store.dispatch('notifyFieldChange', {
      containerUuid,
      containerManager,
      field: fieldAttributes,
      columnName
    })
  }

  return {
    blankValues,
    contextAttributesList,
    isShowedPopover,
    uuidForm,
    warehouseId,
    clearValues,
    close,
    setValues
  }
}