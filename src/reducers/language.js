import { CHANGE_LANGUAGE } from "../constants/actionTypes"

const languageReducer = (state = { isEnglish: true }, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return { ...state, isEnglish: action.payload }
    default:
      return state
  }
}

export default languageReducer
