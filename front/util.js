const fs = require('fs');
const path = require('path');
// 获取指定文件夹下所有测试文件
async function getAllTestFiles(filePath) {
    let testFilenames = [];
    //根据文件路径读取文件，返回文件列表
    try {
        // 获取目录列表
        const files = await new Promise((resolve, reject) => {
            fs.readdir(filePath, (err, files) => {
                if (err) reject(err);
                resolve(files);
            });
        });
        // 将目录列表封装为promise数组
        const promiseFiles = files.map(filename => {
            const filedir = path.join(filePath, filename);
            return new Promise((resolve, reject) => {
                fs.stat(filedir, (err, stats) => {
                    if (err) reject(err);
                    resolve({
                        stats,
                        filedir,
                    });
                });
            });
        });
        // 获取包含stat和对应路径的对象的数组
        const statsObj = await Promise.all(promiseFiles);
        for (const obj of statsObj) {
            const isFile = obj.stats.isFile(); //是文件
            const isDir = obj.stats.isDirectory(); //是文件夹
            if (isFile) {
                if (/[\w]+\.test\.js/.test(obj.filedir)) {
                    testFilenames.push(obj.filedir); //存放到临时数组中。
                }
            }
            if (isDir) {
                const deepFiles = await getAllTestFiles(obj.filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                testFilenames = testFilenames.concat(deepFiles);
            }
        }
        return testFilenames; //返回结果。
    } catch (err) {
        console.error('The error:', err);
    }
}
module.exports = {
    getAllTestFiles,
};