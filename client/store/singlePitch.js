import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_PITCH = 'GET_PITCH'

/**
 * INITIAL STATE
 */
const pitch = {}

/**
 * ACTION CREATORS
 */
const getPitch = selectedPitch => ({type: GET_PITCH, selectedPitch})

/**
 * THUNK CREATORS
 */
export const fetchPitch = pitchId => async dispatch => {
  try {
    const {data: pitch} = await axios.get(`/api/history/${pitchId}`)
    dispatch(getPitch(pitch))
  } catch (error) {
    console.error(error)
  }
}

/**
 * REDUCER
 */
export default function(state = pitch, action) {
  switch (action.type) {
    case GET_PITCH:
      return action.selectedPitch

    default:
      return state
  }
}
