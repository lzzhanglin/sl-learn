import React, { FC } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro'
import { useQuery, QueryCache, useQueryClient } from 'react-query'
import axios from 'axios'
import {SERVER_URL} from '../../config/server'
import Question from '../subject/Question'

import styles from './index.less'




interface IndexProps {

}

const txt = '迎接新年，聆听钟声，那扩散的声波犹如一圈圈年轮，把无尽的岁月沧桑包裹在历史与现实之中。钟声，神圣、雄浑、绵长，震撼人心。我在欧·亨利的《警察与赞美诗》里读到过这样的钟声，那个小偷索比不是被警察驯服的，而是被教堂的钟声所感化。教堂里响起悠扬的钟声，宣告着一场祈祷与忏悔的开始，它让灵魂在这里栖息，让浮躁的心归于平静。记得有位作家曾说过：“钟声不为过去，也不为将来。人心安静下来，就能听到美丽的钟声，就会有一次心灵深处的碰撞。”江南历来为繁华之地，想必姑苏城外的枫桥也是灯红酒绿，歌舞翩翩。追逐名利、纵情玩乐者，哪能静夜观风，梳理心绪，聆听到如此迷人的寒山寺钟声。只有张继这位多愁的诗人，在寂静的深秋寒夜，用一颗平静的心去感受万物，才听出了这一鸣惊人的钟声。被张继感悟出真谛之后，寒山寺的钟声便能与心灵相通，于是就有了涤荡人心的力量。年年岁岁，这钟声不知激荡起多少乡愁，情愁，国愁……余音袅袅的钟声会告诉人们什么是古朴，什么是现代，更珍贵的是，人们会在这样的钟声里走向新生，走向美好。钟声激荡，一只只白鸽在冬日的晴空里展翅飞翔，声声鸽哨掠过蓝天与厚重的钟音遥相呼应。于是，你的思绪在钟声里回荡，跨越过去与未来的疆域；跨越历史与时空的沟壑；跨越客观与主观的障碍……世间红尘，人生百态，浮华的即将沦没；慵懒的必将沉睡；奋斗的终将腾飞！任你是在胜利中微笑，还是在失败中哭泣；任你哀叹、忧伤、悲痛还是激昂、豪放、雄壮，岁月的步伐依然如故！那钟声，如进军的号角，如催征的战鼓，越敲越响，穿透灵魂，抚慰心灵。人们就在钟声里聆听幸福，把日子过得安宁而坦然，明媚而温暖。钟声悠悠，年轮圈圈。人们在或清脆悠扬，或浑厚绵远的钟声里辞旧岁，迎新年；告严寒，接新春。聆听新年的钟声，于身是一种沐浴，于心是一种净化。钟声的低沉，让所有的灵魂平静；钟声的古韵，让所有的时光变得温馨；钟声的悠扬，让所有的憧憬变得清晰；钟声的雄浑，让所有的生命变得豪放……让钟声涤荡心灵，岁月钟声，年轮人生。新年的钟声，既回旋着历史的沧桑，也面对着未来的召唤！'

const  Index : FC<IndexProps> = (props) => {

  const client = useQueryClient()


  const renderText = () =>{
    let result = []
    for(let char of txt){
      result.push(<span onClick={()=>console.log('点击-->', char)}>{char}</span>)
    }
    return result
  }

  const addQuestion = () =>{
    Taro.navigateTo({
      url: '/pages/subject/AddQuestion'
    })
  }


  const renderQuestionListHtml = () =>{
    const {data, isLoading, isError} = useQuery('questionList', () => axios.get(`${SERVER_URL}question/getAllQuestion`))
    if(isLoading){
      return <View>数据加载中</View>
    }
    if(isError){
      return <View>请求错误，请重试</View>
    }
    if(data?.data?.data){
      const list = data.data.data
      // client.setQueryData('questionList', list)
      console.log('数据为-->', list)
      return list.map(item=>{
        return <Question key={item.createTime} id={item.id} title={item.title} createTime={item.createTime} />
      })
    }
  }
 
  return (
    <View className={styles['index']}>
      <View className='top-btn-wrapper'>
        <AtButton type='primary' onClick={addQuestion}>添加题目</AtButton>
      </View>
      {renderQuestionListHtml()}
      </View>
  )
}

export default Index
