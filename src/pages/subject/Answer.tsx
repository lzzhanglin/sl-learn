import React, {FC, useState, useEffect} from 'react'
import {View} from '@tarojs/components'
import {useSelector, useDispatch} from 'react-redux'
import {useQueryClient} from 'react-query'
import moment from 'moment'
import styles from './Answer.less'
import {app} from '../../models'
import {ConnectState} from '../../models/connect'

interface AnswerProps {
    id: number,
    questionId: number,
    content: string,
    username: string,
    updateTime: number,
}

const Answer : FC<AnswerProps> = (props) =>{

    const client = useQueryClient()
    const dispatch = useDispatch()

    const {username, updateTime, id, content, questionId} = props





    const [startIndex, setStartIndex] = useState<number>(-1)
    const [endIndex, setEndIndex] = useState<number>(-1)
    const paragraphInfo = useSelector((state : ConnectState)=> state.app.paragraphInfo)

    const setParagraphInfo = (text) =>{
      dispatch({
        type: `${app}/setParagraphInfo`,
        payload: text,
      })
    }

    useEffect(() => {
      if(startIndex !== -1 && endIndex !== -1){
        const text = content?.substring(startIndex, endIndex + 1)
        const param = {
          questionId: questionId,
          answerId: id,
          startIndex: startIndex,
          endIndex: endIndex,
          text: text,
        }
        setParagraphInfo(param)
      }
    }, [startIndex, endIndex])

    useEffect(() => {
      if(paragraphInfo.answerId !== id){
        //选中的不是当前答案 把选中的文本清除
        setStartIndex(-1)
        setEndIndex(-1)
      }

    }, [paragraphInfo])


    const clickChar = (idx, char) =>{
      //首次点击 
      if(startIndex === -1){
        setStartIndex(idx)
        setEndIndex(idx)
      }
      //点击的字符在起始字符的后面
      if(startIndex > -1 && idx > startIndex){
        setEndIndex(idx)
      }
      if(startIndex !== -1 && idx < startIndex){
        setStartIndex(idx)
      }
      if(endIndex !== -1 && idx > endIndex){
        setEndIndex(idx)
      }
    }

    const clearParagraph = () =>{
        setAnswerStartIndex(-1)
        setAnswerEndIndex(-1)
    }

    const renderStyle = (idx) => {
        
        if(startIndex <= idx && idx <= endIndex){
          return {color: 'red'}
        }
        if(startIndex === idx && endIndex === -1){
          return {color: 'red'}
        }
    }

    const renderText = (txt) =>{
        let result = []
        for(let i = 0; i < txt.length; i++){
          const str = txt.charAt(i)
          result.push(<span key={i} onClick={()=>clickChar(i, str)} style={renderStyle(i)}>{str}</span>)
        }
        return result
      }
    return (
        <View className={styles['answer']}>
          
            <View className='middle-answer-div'>
                <View className='content'>{renderText(content ?? '')}</View>
            </View>
            <View className='bottom-answer-div'>
                <View className='username'>{username}</View>
                <View className='update-time'>{moment(updateTime).format('YYYY-MM-DD HH:mm:ss')}</View>
            </View>

        </View>
    )
}

export default Answer