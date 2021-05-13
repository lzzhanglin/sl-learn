import React, {FC, useState, useEffect} from 'react'
import {View} from '@tarojs/components'
import moment from 'moment'
import styles from './Answer.less'

interface AnswerProps {
    id: number,
    content: string,
    username: string,
    updateTime: number,
}

const Answer : FC<AnswerProps> = (props) =>{

    const {username, updateTime, id, content} = props
    return (
        <View className={styles['answer']}>
          
            <View className='middle-answer-div'>
                <View className='content'>{content}</View>
            </View>
            <View className='bottom-answer-div'>
                <View className='username'>{username}</View>
                <View className='update-time'>{moment(updateTime).format('YYYY-MM-DD HH:mm:ss')}</View>
            </View>

        </View>
    )
}

export default Answer