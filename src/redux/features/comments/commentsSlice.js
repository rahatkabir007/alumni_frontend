import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedComment: null,
    replyDepth: 3, // Maximum reply nesting depth
    showNestedReplies: {},
    expandedComments: {},
};

export const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        setSelectedComment: (state, action) => {
            state.selectedComment = action.payload;
        },
        setReplyDepth: (state, action) => {
            state.replyDepth = action.payload;
        },
        toggleNestedReplies: (state, action) => {
            const replyId = action.payload;
            state.showNestedReplies[replyId] = !state.showNestedReplies[replyId];
        },
        toggleExpandedComment: (state, action) => {
            const commentId = action.payload;
            state.expandedComments[commentId] = !state.expandedComments[commentId];
        },
        clearCommentsState: (state) => {
            state.selectedComment = null;
            state.showNestedReplies = {};
            state.expandedComments = {};
        }
    }
});

export const {
    setSelectedComment,
    setReplyDepth,
    toggleNestedReplies,
    toggleExpandedComment,
    clearCommentsState
} = commentsSlice.actions;

export default commentsSlice.reducer;