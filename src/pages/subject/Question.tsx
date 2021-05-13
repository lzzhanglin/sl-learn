import {FC, useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import moment from 'moment'

import styles from './Question.less'

interface QuestionProps {
    id: number,
    title: string,
    createTime: number,
}

const Question : FC<QuestionProps> = ({id, title, createTime}) =>{

    const gotoDetail = () =>{
        Taro.navigateTo({
            url: `/pages/subject/QuestionDetail?id=${id}`
        })
    }
    return (
        <View className={styles['question']}>
            <View className='qus-item' onClick={gotoDetail}>
                <View className='qus-title'>{title}</View>
                <View className='time-wrapper'>
                    <View className='time-title'>创建时间</View>
                    <View className='time-value'></View>{moment(createTime).format('YYYY-MM-DD HH:mm')}</View>
            </View>
        </View>
    )
}

export default Question