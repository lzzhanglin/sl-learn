import React, {FC, useState, useEffect} from 'react'
import {View} from '@tarojs/components'
import Taro, {useRouter} from '@tarojs/taro'
import axios from 'axios'

import { useQuery, QueryCache, useQueryClient } from 'react-query'
import {AtIcon, AtFloatLayout, AtTextarea, AtMessage, AtButton  } from 'taro-ui'
import styles from './QuestionDetail.less'
import { AxiosRespType } from '../index/main'
import {SERVER_URL} from '../../config/server'
import {useInterval} from '../../utils/ToolHooks'
import Answer from './Answer'





interface QuestionDetailProps {
    
}

const QuestionDetail : FC<QuestionDetailProps> = (props) => {

    const router = useRouter()
    const client = useQueryClient()

    const [issueVisible, setIssueVisible] = useState<boolean>(false)
    const [editVisible, setEditVisible] = useState<boolean>(false)
    const [answer, setAnswer] = useState<string>('')
    const [answerId, setAnswerId] = useState<number>()

    const [startIndex, setStartIndex] = useState<number>(-1)
    const [endIndex, setEndIndex] = useState<number>(-1)

    const {data, isLoading, isError} = useQuery('questionDetail', ()=> axios.get(`${SERVER_URL}question/getQuestionDetailById`, {params:{id: router.params?.id}}))
    const currentQuestion = data?.data?.data

    const clickChar = (idx, char) =>{
      if(startIndex === -1){
        setStartIndex(idx)
      }
      if(startIndex > -1 && endIndex === -1){
        setEndIndex(idx)
      }
      if(startIndex !== -1 && idx < startIndex){
        setStartIndex(idx)
      }
      if(endIndex !== -1 && idx > endIndex){
        setEndIndex(idx)
      }
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
      // for(let char of txt){
        
      // }
      return result
    }

    const clearParagraph = () =>{
      setStartIndex(-1)
      setEndIndex(-1)
    }

    const saveAnswer = () =>{
      const param = {
        questionId: router.params?.id,
        content: answer,
        username: 'sudo',
      }
      //如果存在answerId 则更新数据
      if(answerId){
        axios.post(`${SERVER_URL}answer/updateAnswer`, {...param, id: answerId})
        .then(resp=>{
          if(resp?.data?.status === 200){
            Taro.atMessage({
              message: '更新答案成功',
              type: 'success'
            })
          }
        }).catch(error => {
          alert('更新失败')
        })
      }else{
        axios.post(`${SERVER_URL}answer/addAnswer`,param)
        .then(res=>{
          if(res?.data?.status === 200){
            setAnswerId(res.data.data)
            Taro.atMessage({
                message: '保存成功',
                type: 'success'
            })
          }
        }).catch(error=>{
          alert('保存失败')
        })
      }
      
    }

    const renderAnswerListHtml = () =>{
      const {data, isLoading, isError} = useQuery('answerList', ()=> axios.get(`${SERVER_URL}answer/getAnswerListByQuestionId`, {params:{questionId: router.params?.id}}))
      console.log('answerList--->', data)
      if(isLoading){
        return <View>加载中</View>
      }
      if(isError){
        return <View>出错了</View>
      }
      return (data?.data?.data || []).map(item=>{
        return <Answer key={item.id} id={item.id} content={item.content} username={item.username} updateTime={item.updateTime} />
      })
    }

    

    return (
        <View className={styles['questionDetail']}>
            <AtMessage />
            <View className='top-div'>
                {/* <View className='title'>{currentQuestion?.title}</View> */}
                <View className='operate-tip'>点击要选择的文本的首尾两个汉字，即可选择文本,点击右边x图标即可清除选择</View>
            </View>
            <View className='middle-div'>
                <View className='content'>
                  {renderText(currentQuestion?.content ?? '')}
                </View>
            </View>
            <View className='clear-wrapper' onClick={clearParagraph}>
                <AtIcon value='close' size='30' color='red'></AtIcon>
            </View>
            <View className='issue-wrapper' onClick={()=>setIssueVisible(!issueVisible)}>
                <AtIcon value='help' size='30' color='orange'></AtIcon>
            </View>
            <View className='edit-wrapper' onClick={() =>setEditVisible(!editVisible)}>
                <AtIcon value='edit' size='30' color='#1890ff'></AtIcon>
            </View>
            <View className='issue-modal'>
              <AtFloatLayout isOpened={issueVisible} title="问题" onClose={()=>setIssueVisible(false)}>
                <View className={styles['issueModal']}>
                  <View>{currentQuestion?.issue}</View>
                </View>
                
              </AtFloatLayout>
            </View>
            <View className='edit-modal'>
              <AtFloatLayout isOpened={editVisible} title="请输入答案,文档将自动保存,可直接关闭" onClose={()=>setEditVisible(false)}>
                <View className={styles['editModal']}>
                  <AtTextarea
                  value={answer}
                  onChange={(value) => setAnswer(value)}
                  maxLength={currentQuestion?.wordLimit}
                  height={200}
                  placeholder='请输入答案'
                />
                <View className='save-btn-wrapper'>
                  <AtButton onClick={() =>setAnswer('')}>清除</AtButton>
                  <AtButton type='primary' onClick={saveAnswer}>保存</AtButton>
                </View>
                </View>
              </AtFloatLayout>
            </View>
            {renderAnswerListHtml()}
        </View>
    )
}

export default QuestionDetail