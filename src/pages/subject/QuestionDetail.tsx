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
      //?????????????????????????????? ???????????????????????? ???????????????????????????????????? ????????????????????????
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
            //??????????????????????????????
            setStartIndex(p.startIndex)
            setEndIndex(p.endIndex)
            setPId(p.id)
          }
          
        }).catch(error =>{
          alert('??????????????????')
        })
      }
   

    }, [startIndex, endIndex, annotationVisible])

    const clickChar = (idx, char) =>{
      //???????????? 
      if(startIndex === -1){
        setStartIndex(idx)
        setEndIndex(idx)
      }
      //???????????????????????????????????????
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
      //????????????answerId ???????????????
      if(answerId){
        axios.post(`${SERVER_URL}answer/updateAnswer`, {...param, id: answerId})
        .then(resp=>{
          if(resp?.data?.status === 200){
            Taro.atMessage({
              message: '??????????????????',
              type: 'success'
            })
            client.invalidateQueries('answerList')
          }
        }).catch(error => {
          alert('????????????')
        })
      }else{
        axios.post(`${SERVER_URL}answer/addAnswer`,param)
        .then(res=>{
          if(res?.data?.status === 200){
            setAnswerId(res.data.data)
            Taro.atMessage({
                message: '????????????',
                type: 'success'
            })
            client.invalidateQueries('answerList')
          }
        }).catch(error=>{
          alert('????????????')
        })
      }
      
    }

    const renderAnswerListHtml = () =>{
      const {data, isLoading, isError} = useQuery('answerList', ()=> axios.get(`${SERVER_URL}answer/getAnswerListByQuestionId`, {params:{questionId: router.params?.id}}))
      if(isLoading){
        return <View>?????????</View>
      }
      if(isError){
        return <View>?????????</View>
      }
      return (data?.data?.data || []).map(item=>{
        return <Answer questionId={currentQuestion.id} key={item.id} id={item.id} content={item.content} username={item.username} updateTime={item.updateTime} />
      })
    }

    const renderAnnotationHtml = () =>{
        if(startIndex === -1 && endIndex === -1){
          return <View>???????????????</View>
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
              message: '??????????????????',
              type: 'success'
            })
            //??????????????? ????????????????????? ?????????????????? ???????????????????????????
            setAnnotation('')
          }

        }).catch(err=>{
          alert('??????????????????')
        })
    }

    

    return (
        <View className={styles['questionDetail']}>
            <AtMessage />
            <View className='top-div'>
                {/* <View className='title'>{currentQuestion?.title}</View> */}
                <View className='operate-tip'>?????????????????????????????????????????????,??????????????????,????????????x??????????????????,??????????????????????????????????????????????????????????????????</View>
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
              <AtFloatLayout isOpened={issueVisible} title="??????" onClose={()=>setIssueVisible(false)}>
                <View className={styles['issueModal']}>
                  <View>{currentQuestion?.issue}</View>
                </View>
                
              </AtFloatLayout>
            </View>

            <View className='annotaion-modal'>
              <AtFloatLayout isOpened={annotationVisible} title="??????" onClose={()=>setAnnotationVisible(false)}>
                <View className={styles['annotationModal']}>
                  <View className='modal-top'>{renderAnnotationHtml()}</View>
                  <AtTextarea
                    value={annotation}
                    onChange={(value) => setAnnotation(value)}
                    maxLength={1000}
                    height={200}
                    placeholder='???????????????'
                  />
                  <View className='save-btn-wrapper'>
                    <AtButton onClick={() =>setAnnotation('')}>??????</AtButton>
                    <AtButton type='primary' onClick={saveParagraphAndAnnotation}>??????</AtButton>
                  </View>
                </View>
                
              </AtFloatLayout>
            </View>
            <View className='edit-modal'>
              <AtFloatLayout isOpened={editVisible} title="???????????????,?????????????????????????????????" onClose={()=>setEditVisible(false)}>
                <View className={styles['editModal']}>
                  <AtTextarea
                    value={answer}
                    onChange={(value) => setAnswer(value)}
                    maxLength={currentQuestion?.wordLimit}
                    height={200}
                    placeholder='???????????????'
                  />
                <View className='save-btn-wrapper'>
                  <AtButton onClick={() =>setAnswer('')}>??????</AtButton>
                  <AtButton type='primary' onClick={saveAnswer}>??????</AtButton>
                </View>
                </View>
              </AtFloatLayout>
            </View>
            <View className='answer-title'>????????????</View>
            {renderAnswerListHtml()}
        </View>
    )
}

export default QuestionDetail