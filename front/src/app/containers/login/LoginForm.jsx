import { hot, } from 'react-hot-loader/root';
import loadable from '@loadable/component';
import React, { Component, } from 'react';
import { Form, Input, Icon, Radio, Button, Select, Checkbox, Cascader, AutoComplete, Col, Row, } from 'antd';
import { addressOptions, } from './constans';
import style from './style.css';
import { loginBannerImages as imgPaths, } from '@/constants';

const FormItem = Form.Item;
const Banner = loadable(() => import('@/components/banner/Banner'));

@Form.create()
class LoginForm extends Component {
  state = { autoCompleteOptions: [], rePasswordDirty: false, }
  // 确定密码时离开输入框时判断是否已输入
  componentDidUpdate() {
    if (!this.props.isLogin && !this.reseted) {
      this.props.form.resetFields();
      this.reseted = true;
    }
    if (this.props.isLogin) {
      this.reseted = false;
    }
  }
  reseted = false;
  handleRepasswordBlur = (event) => {
    this.setState({ rePasswordDirty: this.state.rePasswordDirty || !!event.target.value, });
  }
  // 自动补充站点后缀
  handleWebsiteChange = (value) => {// a => [a.com,a.cn,a.org]
    let { autoCompleteOptions, } = this.state;
    if (value) {
      autoCompleteOptions = ['.com', '.cn', '.org', ].map(domain => value + domain);
    } else {
      autoCompleteOptions = [];
    }
    this.setState({ autoCompleteOptions, });
  }
  validateRepassword = () => {
    this.state.rePasswordDirty && this.props.form.validateFields(['repassword', ], { force: true, });
  }
  comparePassword = (rule, value, callback) => {
    const password = this.props.form.getFieldValue('password');
    if (value === password) {
      callback();
    } else {
      callback('密码和确认密码不一致!');
    }
  }
  refreshCaptcha = (event) => {
    event.target.src = this.props.captchaUrl + '&ts=' + Date.now();
  }
  render() {
    const { handleSubmit, form: { getFieldDecorator, }, changeLoginStatus, isLogin, returnHome, } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    const formTailItemLayout = {
      wrapperCol: {
        span: 20,
        offset: 4,
      },
    };
    const formLastItemLayout = {
      wrapperCol: {
        span: 24,
      },
    };
    const countrySelector = getFieldDecorator('prefix', {
      initialValue: '086',
    })(<Select>
      <Select.Option value="086">086</Select.Option>
      <Select.Option value="087">087</Select.Option>
    </Select>);
    const websiteOptions = this.state.autoCompleteOptions.map(option => (
      <AutoComplete.Option key={option}>{option}</AutoComplete.Option>
    ));
    return (
      <>
        <div className={style.form_container}>
          <Form onSubmit={handleSubmit}
            style={{ width: isLogin ? '400px' : '500px', marginTop: isLogin ? '10vh' : '3vh', }}
            {...formItemLayout}
          >
            <h3>欢迎{isLogin ? '登录' : '注册'}</h3>
            <FormItem label="用户名" >
              {
                getFieldDecorator('username', {
                  rules: [{ required: true, message: '用户名必须输入!', }, ],
                })(<Input autoComplete="username" prefix={<Icon style={{ color: 'rgba(0,0,0,.25)', }}
                  type="user"
                />}
                />)
              }
            </FormItem>
            <FormItem label="密码" >
              {
                getFieldDecorator('password', {
                  rules: [{ required: true, message: '密码必须输入!', },
                  { validator: this.validateRepassword, }, ],
                })(<Input.Password autoComplete="current-password"
                  prefix={<Icon style={{ color: 'rgba(0,0,0,.25)', }}
                    type="lock" />}
                />)
              }
            </FormItem>
            {
              !isLogin && <FormItem label="确认密码" >
                {
                  getFieldDecorator('repassword', {
                    rules: [{ required: true, message: '确认密码必须输入!', },
                    { validator: this.comparePassword, }, ],
                  })(<Input.Password autoComplete="current-password"
                    onBlur={this.handleRepasswordBlur}
                    prefix={<Icon style={{ color: 'rgba(0,0,0,.25)', }}
                      type="lock"
                    />}
                  />)
                }
              </FormItem>
            }
            {
              !isLogin && <FormItem label="邮箱" >
                {
                  getFieldDecorator('email', {
                    rules: [{ required: true, message: '邮箱必须输入!', }, { email: true, message: '邮箱格式不合法!', }, ],
                  })(<Input prefix={<Icon style={{ color: 'rgba(0,0,0,.25)', }}
                    type="mail"
                  />}
                  />)
                }
              </FormItem>
            }
            {
              !isLogin && <FormItem label="性别" >
                {
                  getFieldDecorator('gender')(
                    <Radio.Group >
                      <Radio checked
                        value={1}
                      >男</Radio>
                      <Radio value={0}>女</Radio>
                    </Radio.Group>)
                }
              </FormItem>
            }


            {
              !isLogin && <FormItem label="住址" >
                {
                  getFieldDecorator('address', {
                    initialValue: ['zhejiang', 'hangzhou', 'xihu', ],
                    rules: [{ type: 'array', required: true, message: '住址必须输入!', }, ],
                  })(<Cascader options={addressOptions} />)
                }
              </FormItem>
            }

            {
              !isLogin && <FormItem label="手机号" >
                {
                  getFieldDecorator('phone', {
                    rules: [{ required: true, message: '手机号必须输入!', }, ],
                  })(<Input addonBefore={countrySelector}
                    style={{ width: '100%', }}
                  />)
                }
              </FormItem>
            }

            {
              !isLogin && <FormItem label="个人主页" >
                {
                  getFieldDecorator('website', {
                    rules: [{ required: true, message: '个人主页必须输入!', }, ],
                  })(<AutoComplete
                    dataSource={websiteOptions}
                    onChange={this.handleWebsiteChange}
                    placehold="请输入网址"
                  >
                    <Input />
                  </AutoComplete>)
                }
              </FormItem>
            }
            {
              <FormItem label="验证码">
                <Row>
                  <Col span={isLogin ? 12 : 16}>
                    {
                      getFieldDecorator('captcha', {
                        rules: [{ required: true, message: '验证码必须输入!', }, ],
                      })(
                        <Input />
                      )
                    }
                  </Col>
                  <Col span={isLogin ? 6 : 8}>
                    <img alt="captcha"
                      onClick={this.refreshCaptcha}
                      src={this.props.captchaUrl}
                    />
                  </Col>
                </Row>
              </FormItem>
            }

            {
              !isLogin && <FormItem {...formTailItemLayout}>
                {
                  getFieldDecorator('aggrement', {
                    valuePropName: 'checked',
                  })(
                    <Checkbox>我已经阅读并同意<a href="#">协议</a></Checkbox>
                  )
                }
              </FormItem>
            }

            <FormItem {...formLastItemLayout}>
              <Button htmlType="submit"
                style={{ width: '100%', }}
                type="primary"
              >{isLogin ? '登录' : '注册'}</Button>
              {isLogin ? '没有账号' : '已有账号'}<span className={style.link}
                onClick={changeLoginStatus}
              >{isLogin ? '立刻注册' : '立刻登录'}</span><br /><span className={style.link}
                onClick={returnHome}
              >返回首页</span>
            </FormItem>
          </Form>
        </div>

        <Banner imagePaths={imgPaths}
          size={{ height: '100vh', minHeight: '940px', }}
        />
      </>);
  }
}
let DefaultLoginForm = LoginForm;
if (process.env.NODE_ENV === 'development') {
  DefaultLoginForm = hot(LoginForm);
}
export default DefaultLoginForm;