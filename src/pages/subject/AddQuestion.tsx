import React,{useState, useEffect, FC} from 'react'
import {View} from '@tarojs/components'
import {AtForm, AtInput, AtTextarea,AtInputNumber, AtButton, AtMessage  } from 'taro-ui'
import { useQuery } from 'react-query'
import Taro from '@tarojs/taro'
import styles from './AddQuestion.less'
import {SERVER_URL} from '../../config/server'

import MyForm,{FormItem} from '../components/MyForm'
import axios from 'axios'

interface AddQuestionProps {

}

const AddQuestion : FC<AddQuestionProps> = (props) => {

    const [title, setTitle] = useState<string>()
    const [content, setContent] = useState<string>()
    const [issue, setIssue] = useState<string>()
    const [wordLimit, setWordLimit] = useState<number>(0)
    const submitData = () =>{
        const param = {
            title,
            content,
            issue,
            wordLimit,
        }
        axios.post(`${SERVER_URL}question/addQuestion`, param)
        .then(res=>{
            if(res?.data?.status === 200){
                Taro.atMessage({
                    message: '添加成功',
                    type: 'success'
                })
                resetData()
            }
        }).catch(error=>{
            console.log('error--->', error)
            alert('添加失败')
        })
    }


    const resetData = () => {
        setTitle('')
        setContent('')
        setIssue('')
        setWordLimit(0)
    }

    const back = () => {
        Taro.navigateBack()
    }

    return (
        <View className={styles['addQuestion']}>
            <AtMessage />
            <View className='main-body'>
                <MyForm>
                    <FormItem isRequired={true} title='题目名称' >
                        <AtInput 
                            border={false}
                            name='title' 
                            type='text' 
                            placeholder='请输入题目名称' 
                            value={title} 
                            onChange={(value: any) => setTitle(value)} 
                        />
                    </FormItem>
                    <FormItem isRequired={true} title='题目内容' >
                        <AtInput 
                            border={false}
                            name='content' 
                            type='text' 
                            placeholder='请输入题目内容' 
                            value={content} 
                            onChange={(value: any) => setContent(value)} 
                        />
                    </FormItem>
                    <FormItem isRequired={true} title='问题' >
                        <AtInput 
                            border={false}
                            name='title' 
                            type='text' 
                            placeholder='请输入问题' 
                            value={issue} 
                            onChange={(value: any) => setIssue(value)} 
                        />
                    </FormItem>
                    <FormItem isRequired={true} title='字数限制' >
                        <AtInput 
                            border={false}
                            name='title' 
                            type='number' 
                            placeholder='请输入字数限制' 
                            value={wordLimit.toString()} 
                            onChange={(value: any) => setWordLimit(value)} 
                        />
                    </FormItem>
                </MyForm>
                <View className='btn-wrapper'>
                    <AtButton onClick={back}>返回</AtButton>
                    <AtButton onClick={submitData} type='primary'>提交</AtButton>
                </View>
            </View>
            
            
        </View>
    )
}

export default AddQuestion