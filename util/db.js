/**
 * Created by heshaoyi on 4/21/16.
 */

"use strict";
var config = require("../config.json"),
    mysql = config.mysql,
    Sequelize = require("sequelize");

var sequelize = new Sequelize(mysql.database, mysql.userName, mysql.password, {
    host: mysql.host,
    dialect: 'mysql',
    pool: {
        max: 20,
        min: 2,
        idle: 10000
    }
});
exports.sequelize = sequelize;

exports.User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING
    }
});


exports.Project = sequelize.define('project', {
    name: {
        type: Sequelize.STRING,
        unique: true
    },
    description: {
        type: Sequelize.STRING
    }
});

exports.User.belongsToMany(exports.Project, {as: 'Projects', through: 'user_projects', foreignKey: 'userId'});
exports.Project.belongsToMany(exports.User, {as: 'Users', through: 'user_projects', foreignKey: 'projectId'});

/**
 * 请求主表
 * @type {Model}
 */
exports.Request = sequelize.define('request', {
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    method: {
        type: Sequelize.STRING
    },
    url: {
        type: Sequelize.STRING
    },
    response_eg: {
        type: Sequelize.TEXT
    }
});

exports.Project.hasMany(exports.Request, {as: 'Requests'});

/**
 * 请求参数
 * @type {Model}
 */
exports.RequestParam = sequelize.define('request_param', {
    key: {
        type: Sequelize.STRING
    },
    value_eg: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    comment: {
        type: Sequelize.STRING
    },
    order: {
        type: Sequelize.INTEGER
    }
});

exports.Request.hasMany(exports.RequestParam, {as: 'Requests'});

/**
 * 响应参数
 * @type {Model}
 */
exports.Response = sequelize.define('response', {
    key: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    comment: {
        type: Sequelize.STRING
    },
    parentId: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    order: {
        type: Sequelize.INTEGER
    }
});

exports.Request.hasMany(exports.Response);

sequelize.sync();

