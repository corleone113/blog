
> [blog](https://github.com/corleone113/blog) 是我个人基于React全家桶+Express+MongoDB开发的个人博客平台项目。

## 项目运行效果
- 首页
![home](./screenshots/home.PNG)

- 文章详情页

![article_detail](./screenshots/detail.PNG)

- 登录

![signin](./screenshots/signin.PNG)

- 注册

![signup](./screenshots/signup.PNG)

- 角色管理

![role_mange](./screenshots/role.PNG)

- 用户管理

![user_mange](./screenshots/user.PNG)

- 标签管理

![tag_mange](./screenshots/tag.PNG)

- 文章管理

![article_mange](./screenshots/article1.PNG)
![article_mange](./screenshots/article2.PNG)

## 运行

    git clone https://github.com/corleone113/blog.git
    
    npm i
    
进入后端代码目录(server文件夹),然后安装依赖

    npm i
    
打开server/config/index.js文件，修改apiHost为你本机IP或你部署的服务器地址，dbHost则为mongodb数据的地址，端口号随意

启动后端服务

    npm start 

进入前端代码目录(front文件夹),然后安装依赖


    npm i 

打开front/config/config.js文件，apiHost和apiPort修改为和server/config/index.js中一样的值，host和port代表前端静态(代理)服务器的IP和端口

启动前端静态服务

    npm start 

## 注意事项

front/package.json中dll命令为打包dll的命令，如果要打包生产版本(使用build_server_prod命令)或打包生产版本并启动(使用start_prod命令)之前要执行这个命令，因为生产版本打包优化配置时使用了这些dll文件。