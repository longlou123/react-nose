module.exports = {
	entry: './src/main.js',//项目入口文件
	output: {//项目输出文件
		path: __dirname,
		filename: 'dist/app.js'
	},
	module: {
		loaders: [//配置loader的执行规则
			{test: /\.js$/, loader: 'babel-loader', exclude:/node_modules/},
			{test: /\.css$/, loader: 'style-loader!css-loader'},
			{test: /\.(png|jpg|jpeg|gif|ttf)/, loader: 'file-loader'}
		]
	}
}