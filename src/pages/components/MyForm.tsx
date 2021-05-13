import React, {useState, useEffect, useRef, ReactNode, useCallback, FC} from 'react'
import Taro from '@tarojs/taro'
import {View, Button, Text, } from '@tarojs/components'
import {AtForm, AtInput, AtIcon} from 'taro-ui'

import styles from './MyForm.less'


type FormItemType = {
    children: ReactNode,
    title: string, 
    isRequired?: boolean,
}

const FormItem : FC<FormItemType> = (props) => {
    const {children, title, isRequired=false} = props

    


    return (
        <View className={styles['formItem']}>
          <View className='top-div'>
            {isRequired && <View className='required'>*</View>}
            <View className='title'>{title}:</View>
          </View>
          <View className='bottom-div'>
            {children}
            {/* 这里右边那个大于符号 也有外面使用的组件一并传入，因为这里写的话 点击事件不会生效 */}
          </View>
        </View>
    )
}

type MyFormType = {
  hasTabBar?: boolean,
}

//通过把表单包起来 实现监听键盘的相关事件
const MyForm : FC<MyFormType> = ({hasTabBar = false, children}) => {


  const [isReset, setIsReset] = useState<boolean>(false)

    const originHeight = document.documentElement.clientHeight || document.body.clientHeight;

    const focusinHandler = useCallback( () => {
       //聚焦时键盘弹出，焦点在输入框之间切换时，会先触发上一个输入框的失焦事件，再触发下一个输入框的聚焦事件
       setIsReset(false)
    }, [])

    const focusoutHandler = useCallback(() => {
      setIsReset(true)
      setTimeout(() => {
          //当焦点在弹出层的输入框之间切换时先不归位
          if (isReset) {
              window.scroll(0, 0); //确定延时后没有聚焦下一元素，是由收起键盘引起的失焦，则强制让页面归位
          }
      }, 30);
      }, [isReset])

    const resizeHandler = useCallback(() => {
      
      const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
      const activeElement = document.activeElement;
      console.log('手机屏幕高度为', originHeight, 'resize高度为', resizeHeight,'活跃元素为-->', activeElement)
      if (resizeHeight < originHeight) {
        console.log('键盘弹起来')
          // 键盘弹起后逻辑
          if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
          setTimeout(()=>{
            console.log('滚动到可视区域')
              activeElement.scrollIntoView({ block: 'center' });//焦点元素滚到可视区域的问题
          },0)
          }
      } else {
          // 键盘收起后逻辑
          console.log('键盘收回去')
      }
      }, [])

    useEffect(() =>{
      const ua = window.navigator.userAgent.toLocaleLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(ua);
      const isAndroid = /android/.test(ua);
      if(isIOS){
        document.body.addEventListener('focusin', focusinHandler);
        document.body.addEventListener('focusout', focusoutHandler);
      }
      if(isAndroid){
        console.log('添加监听事件')
        window.addEventListener('resize', resizeHandler);
      }
      return () =>{
        if(isIOS){
          document.body.removeEventListener('focusin', focusinHandler);
          document.body.removeEventListener('focusout', focusoutHandler);
        }
        if(isAndroid){
          console.log('移除监听事件')
          document.body.removeEventListener('resize', resizeHandler);
        }
      }
      
    }, [focusinHandler, focusoutHandler, resizeHandler])
  return (
          <View className={styles['myForm']} style={hasTabBar ? {marginBottom: '45px'} : {}}>
            {children}
          </View>
  )
}
export default MyForm
export {FormItem}
