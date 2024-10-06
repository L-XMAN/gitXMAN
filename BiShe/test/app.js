const mysql = require("mysql");
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
const { log } = require("console");
app.use(cors())

//创建连接对象
const db = mysql.createPool({
    host: "localhost", // MySQL 地址
    port: 3306, // MySQL 端口
    user: "root", // MySQL 用户名
    password: "root", // MySQL 密码
    database: "graduation" // 数据库名称
});


//数据库图片接口
app.get('/getphoto', (req, res) => {
    db.query('select Photo from photo', (err, results) => {
        if (err) {
            result = {
                warn: 'error',
                message: "获取数据库时发生错误"
            },
                res.send(JSON.stringify(result))
        } else {
            res.send(JSON.stringify(results))
        }
    })
});

app.get('/image', (req, res) => {
    let { file } = req.query;
    // 图片文件的路径  
    // const imagePath = 'D:/PHOTO/IMG_20240519_200627.jpg';
    // 读取图片文件  
    console.log("测试" + file);
    fs.readFile(file, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // 设置响应的内容类型为图片类型  
            res.setHeader('Content-Type', 'image/jpeg');
            console.log("测试", data)
            // 发送图片数据  
            res.send(data);
        }
    });
});

//数据库留言内容接口
app.get('/getmessage', (req, res) => {
    db.query('select * from message', (err, results) => {
        if (err) {
            result = {
                warn: 'error',
                message: "获取数据库时发生错误"
            },
                res.send(JSON.stringify(result))
        } else {
            res.send(JSON.stringify(results))
        }
    })
})

// 解析JSON数据  
app.use(express.json());

//post请求
app.post('/setmessage', (req, res) => {
    const { text } = req.body;
    //SQL插入语句
    if (text.length > 0) {
        //获取留言时间
        const date = new Date();
        const Y = date.getFullYear();//年
        const M = date.getMonth() + 1;//月
        const D = date.getDate();//日
        const H = date.getHours();//时
        const min = date.getMinutes();//分
        const s = date.getSeconds();//秒
        const messageTime = Y + '-' + M + '-' + D + ' ' + H + ':' + min + ':' + s
        console.log(messageTime)


        //保存留言
        const sql = 'INSERT INTO message (message,time) VALUES (?,?)';
        db.query(sql, [text, messageTime], (err, results, fields) => {
            if (err) {
                // 如果有错误，返回错误响应  
                console.error(err);
                return res.status(500).send('Error saving text');
            }
            // 如果没有错误，返回成功响应  
            res.status(201).send('Text saved successfully');
        })
    } else {
        console.log('空字符！不保存')
    }
})


app.listen(8000, () => {
    console.log('服务器已经启动');
})



//关闭连接
// connection.end()