import axios from 'axios';

type ParagraphType = {
    startIndex: number,
    endIndex: number,
    questionId: number,
    answerId: number,
    text: string,
}
type DefaultType = {
    paragraphInfo: ParagraphType,
}

const defaultState : DefaultType = {
    paragraphInfo: {
        startIndex: -1,
        endIndex: -1,
        questionId: 0,
        answerId: 0,
        text: '',
    }
}
export default {
    namespace: 'app',
    state: defaultState,
    subscriptions: {

    },
    effects: {
        *setStartIndex({payload, fn}, {call, put}) {
            yield put({
                type: 'putStartIndex',
                payload: payload,
            });
        },
        *setEndIndex({payload, fn}, {call, put}) {
            yield put({
                type: 'putEndIndex',
                payload: payload,
            });
        },
        *setAnswerStartIndex({payload, fn}, {call, put}) {
            yield put({
                type: 'putAnswerStartIndex',
                payload: payload,
            });
        },
        *setAnswerEndIndex({payload, fn}, {call, put}) {
            yield put({
                type: 'putAnswerEndIndex',
                payload: payload,
            });
        },
     
        *setParagraphInfo({payload, fn}, {call, put}) {
            yield put({
                type: 'putParagraphInfo',
                payload: payload,
            });
        },
     
      
    },
    reducers: {
        putStartIndex(state, { payload }) {
            return {
                ...state,
                startIndex: payload,
            }
        },
        putEndIndex(state, { payload }) {
            return {
                ...state,
                endIndex: payload,
            }
        },
        putAnswerStartIndex(state, { payload }) {
            return {
                ...state,
                answerStartIndex: payload,
            }
        },
        putAnswerEndIndex(state, { payload }) {
            return {
                ...state,
                answerEndIndex: payload,
            }
        },
        
        putParagraphInfo(state, { payload }) {
            return {
                ...state,
                paragraphInfo: payload,
            }
        },
       
    }
}



export type AppState = Readonly<typeof defaultState>