import React, { useEffect, useState } from 'react';
import request from './tools/request';
import './App.css';
import { IQqData } from './tools/interface';
import axios, { CancelTokenSource } from 'axios';

const cache: {[k:string]: IQqData} = {}; // 重复搜索同一个qq时使用缓存

function App() {
  const [qq, setQq] = useState<string>(''); // qq号
  const [loading, setLoading] = useState<boolean>(false) // loading状态
  const [data, setData] = useState<IQqData|null>(); // qq号详情
  const [errMsg, setErrMsg] = useState<string>(''); // 错误信息

  useEffect(() => {
    let timer: number | null; // timer作用是防抖 debounce
    let source: CancelTokenSource; // cancelTokenSource作用是防止2个请求同时存在
    setErrMsg('');
    if (cache[qq]) {
      setData(cache[qq])
      return;
    } else {
      setData(null);
    }
    if (!/^\d*$/.test(qq)) {
      setErrMsg('请输入正确格式的qq号');
    } else if (qq.length >= 5) {
      timer = window.setTimeout(() => {
        timer = null;
        source = axios.CancelToken.source();
        setLoading(true);
        request.get(`https://api.uomg.com/api/qq.info?qq=${qq}`, {
          cancelToken: source.token
        })
          .then(res => {
            if (res.data.code === 1) {
              cache[qq] = res.data;
              setData(res.data);
            } else {
              setErrMsg('没有找到用户');
            }
          })
          .finally(() => {
            setLoading(false);
          })
      }, 200);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
      if (source) source.cancel();
    }
  }, [qq]);

  return (
    <div className="App">
      <h2>QQ号查询</h2>
      <div>
        QQ
        <input
          value={qq}
          onChange={e => setQq(e.target.value)}
          className="input"
          placeholder='请输入qq号'
        />
      </div>

      {
        loading 
          ? <div>加载中...</div>
          : (
            errMsg
            ? <div className='err-msg'>{errMsg}</div>
            : (
              data &&
              <div className='data'>
                <img src={data.qlogo} alt="" />
                <div className='words'>
                  <div className='name'>{data.name}</div>
                  <div className='qq'>{data.qq}</div>
                </div>
              </div>
            )
          )
      }
    </div>
  );
}

export default App;
