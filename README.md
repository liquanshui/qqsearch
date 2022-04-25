# qq号查询coding

项目是使用create-react-app的typescript模板创建的。

## 启动项目
`npm i`
`npm start`

## 注意点

- 快速输入时防止无效请求，useEffect中的请求延迟执行
- 多个请求并行可能造成结果显示混乱，下一个请求发送时，如果上一个请求还没有结束，直接中断
- 来回查询同一个qq号，使用缓存，避免再次请求


