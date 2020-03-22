import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  pageTitle: '',
  pageSubtitle: 'Hello World',
  preferencesPageTitle: '',
  dialogs: {},
  topbarEditViewId: 1,
};

export default createReducer(initialState, {
  [t.CHANGE_DASHBOARD_PAGE_TITLE]: (state, action) => {
    state.pageTitle = action.pageTitle;
  },

  [t.ALTER_DASHBOARD_PAGE_SUBTITLE]: (state, action) => {
    state.pageSubtitle = action.pageSubtitle;
  },

  [t.CHANGE_PREFERENCES_PAGE_TITLE]: (state, action) => {
    state.preferencesPageTitle = action.pageTitle;
  },

  [t.OPEN_DIALOG]: (state, action) => {
    state.dialogs[action.name] = {
      isOpen: true,
      payload: action.payload || {},
    };
  },

  [t.CLOSE_DIALOG]: (state, action) => {
    state.dialogs[action.name] = {
      ...state.dialogs[action.name],
      isOpen: false,
    };
  },

  [t.CLOSE_ALL_DIALOGS]: (state, action) => {
    
  },

  [t.SET_TOPBAR_EDIT_VIEW]: (state, action) => {
  state.topbarEditViewId = action.id;
  }
});

export const getDialogPayload = (state, dialogName) => {
  return typeof state.dashboard.dialogs[dialogName] !== 'undefined'
    ? state.dashboard.dialogs[dialogName].payload : {};
};

export const getDialogActiveStatus = (state, dialogName) => {
  return true;
};