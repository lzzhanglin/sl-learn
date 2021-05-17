import React, {FC, useState, useEffect} from 'react'
import {View} from '@tarojs/components'
import Taro, {useRouter} from '@tarojs/taro'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

import { useQuery, useQueryClient, useMutation } from 'react-query'
import {AtIcon, AtFloatLayout, AtTextarea, AtMessage, AtButton  } from 'taro-ui'
import styles from './QuestionDetail.less'
import {ConnectState} from '../../models/connect'
import {app} from '../../models'
import { AxiosRespType } from '../index/main'
import {SERVER_URL} from '../../config/server'
import {useInterval} from '../../utils/ToolHooks'
import Answer from './Answer'

interface QuestionDetailProps {
    
}


const QuestionDetail : FC<QuestionDetailProps> = (props) => {

    const router = useRouter()
    const client = useQueryClient()
    const dispatch = useDispatch()

    const [issueVisible, setIssueVisible] = useState<boolean>(false)
    const [editVisible, setEditVisible] = useState<boolean>(false)
    const [annotationVisible, setAnnotationVisible] = useState<boolean>(false)
    const [answer, setAnswer] = useState<string>('')
    const [answerId, setAnswerId] = useState<number>()

    const [annotation, setAnnotation] = useState<string>('')
    const [pId, setPId] = useState<number>(-1)

    const {data, isLoading, isError} = useQuery('questionDetail', ()=> axios.get(`${SERVER_URL}question/getQuestionDetailById`, {params:{id: router.params?.id}}))
    const currentQuestion = data?.data?.data
    const paragraphInfo = useSelector((state : ConnectState) =>state.app.paragraphInfo)
    const [startIndex, setStartIndex] = useState<number>(-1)
    const [endIndex, setEndIndex] = useState<number>(-1)

    const setParagraphInfo = (text) =>{
      dispatch({
        type: `${app}/setParagraphInfo`,
        payload: text,
      })
    }

    useEffect(()=>{

      if(startIndex !== -1 && endIndex !== -1){
        const text = currentQuestion?.content?.substring(startIndex, endIndex + 1)
        const param = {
          questionId: currentQuestion?.id,
          answerId: 0,
          text: text,
          startIndex: startIndex,
          endIndex: endIndex,
        }
        setParagraphInfo(param)
        
      }
      //点击的文本变化的同时 把文本添加到后台 随时查询有没有存在的文本 打开弹框才去查询
      if(startIndex > -1 && endIndex > -1 && annotationVisible){
        const param = {
          questionId: currentQuestion?.id,
          answerId: 0,
          startIndex: startIndex,
          endIndex: endIndex,
          content: paragraphInfo?.text,
        }
        axios.post(`${SERVER_URL}paragraph/addParagraph`, param)
        .then(resp=>{
          if(resp?.data?.data){
            const p = resp.data.data
            //这里返回的是文本对象
            setStartIndex(p.startIndex)
            setEndIndex(p.endIndex)
            setPId(p.id)
          }
          
        }).catch(error =>{
          alert('添加文本失败')
        })
      }
   

    }, [startIndex, endIndex, annotationVisible])

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
      const param = {
        questionId: 0,
        answerId: 0,
        startIndex: -1,
        endIndex: -1,
        text: '',
      }
      dispatch({
        type: `${app}/setParagraphInfo`,
        payload: param,
      })
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
            client.invalidateQueries('answerList')
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
            client.invalidateQueries('answerList')
          }
        }).catch(error=>{
          alert('保存失败')
        })
      }
      
    }

    const renderAnswerListHtml = () =>{
      const {data, isLoading, isError} = useQuery('answerList', ()=> axios.get(`${SERVER_URL}answer/getAnswerListByQuestionId`, {params:{questionId: router.params?.id}}))
      if(isLoading){
        return <View>加载中</View>
      }
      if(isError){
        return <View>出错了</View>
      }
      return (data?.data?.data || []).map(item=>{
        return <Answer questionId={currentQuestion.id} key={item.id} id={item.id} content={item.content} username={item.username} updateTime={item.updateTime} />
      })
    }

    const renderAnnotationHtml = () =>{
        if(startIndex === -1 && endIndex === -1){
          return <View>请选择文本</View>
        }
        return <View className='choose-text'>{paragraphInfo?.text}</View>
    }

    const saveParagraphAndAnnotation = () =>{
      
      const param = {
        paragraphId: pId,
        content: annotation,
        creator: 'sudo',
      }
      axios.post(`${SERVER_URL}comment/addComment`, param)
        .then(res=>{
          if(res?.data?.data){
            Taro.atMessage({
              message: '添加评语成功',
              type: 'success'
            })
            //清空评语框 答案是一次新增 后续都是修改 ，评语每次都是新增
            setAnnotation('')
          }

        }).catch(err=>{
          alert('添加评语失败')
        })
    }

    

    return (
        <View className={styles['questionDetail']}>
            <AtMessage />
            <View className='top-div'>
                {/* <View className='title'>{currentQuestion?.title}</View> */}
                <View className='operate-tip'>点击要选择的文本的首尾两个汉字,即可选择文本,点击右边x图标即可清除,选择文本之后点击右边绿色图标即可添加批注内容</View>
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
            <View className='annotation-wrapper' onClick={() =>setAnnotationVisible(!annotationVisible)}>
                <AtIcon value='tag' size='30' color='green'></AtIcon>
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

            <View className='annotaion-modal'>
              <AtFloatLayout isOpened={annotationVisible} title="批注" onClose={()=>setAnnotationVisible(false)}>
                <View className={styles['annotationModal']}>
                  <View className='modal-top'>{renderAnnotationHtml()}</View>
                  <AtTextarea
                    value={annotation}
                    onChange={(value) => setAnnotation(value)}
                    maxLength={1000}
                    height={200}
                    placeholder='请输入评语'
                  />
                  <View className='save-btn-wrapper'>
                    <AtButton onClick={() =>setAnnotation('')}>清除</AtButton>
                    <AtButton type='primary' onClick={saveParagraphAndAnnotation}>保存</AtButton>
                  </View>
                </View>
                
              </AtFloatLayout>
            </View>
            <View className='edit-modal'>
              <AtFloatLayout isOpened={editVisible} title="请输入答案,关闭弹框之后答案会保留" onClose={()=>setEditVisible(false)}>
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
            <View className='answer-title'>答案列表</View>
            {renderAnswerListHtml()}
        </View>
    )
}

export default QuestionDetail