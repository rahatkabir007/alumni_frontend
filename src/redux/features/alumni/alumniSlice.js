import { createSlice } from '@reduxjs/toolkit'

const initialState = {

}

const alumniSlice = createSlice({
    name: 'alumni',
    initialState,
    reducers: {

    }
})

export const {

} = alumniSlice.actions

// Selectors
// export const selectalumnis = (state) => state.alumni.alumnis


export default alumniSlice.reducer