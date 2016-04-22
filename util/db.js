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
        min: 0,
        idle: 10000
    }
});

var User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING,
        field: 'first_name',
        validate: {min: 23}
    },
    lastName: {
        type: Sequelize.STRING,
        validate: {
            notNull: true
        }
    }
});

var Team = sequelize.define('team', {
    name: {
        type: Sequelize.STRING,
        field: 'first_name',
        validate: {min: 23}
    }
});

var UserTeam = sequelize.define('user_team');

User.belongsToMany(Team, {through: UserTeam});
Team.belongsToMany(User, {through: UserTeam});

/**
 * 请求主表
 * @type {Model}
 */
exports.Request = sequelize.define('request', {
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

exports.Request.hasMany(exports.RequestParam);

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

