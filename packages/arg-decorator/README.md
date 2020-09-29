# @umajs/arg-decorator

此包为选用包，是根据 ```@umajs/core``` 中的自定义参数装饰器(createArgDecorator) 扩展的参数装饰器

## 说明
- Param 获取到请求中的param
- Query 获取到请求中的query
- Require 获取请求query中的参数并且必填校验
- ToNumber 获取请求query中的参数，同时类型转换和校验
- ToBoolean 获取请求query中的参数，同时类型转换和校验
- NotEmpty 获取请求query中的参数并且非空校验
- Equals 获取请求query中的参数，同时校验值

- Body 获取POST请求数据
    - isRequire  取值与body同上
    - toNumber    取值与body同上
    - isNumber   取值与body同上
    - notEmpty   取值与body同上
    - equals   取值与body同上
    - isBoolean   取值与body同上
    - toBoolean   取值与body同上