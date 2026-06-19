import request from '@/utils/request'

export function listJobLog(query) {
  const rows = [
    { jobLogId: 1, jobName: '系统数据备份', jobGroup: 'DEFAULT', invokeTarget: 'ryTask.ryNoParams', jobMessage: '执行成功', status: '0', createTime: '2024-12-01 02:00:00', exceptionInfo: '' },
    { jobLogId: 2, jobName: '清理临时文件', jobGroup: 'DEFAULT', invokeTarget: 'ryTask.cleanTemp', jobMessage: '执行成功', status: '0', createTime: '2024-12-01 03:00:00', exceptionInfo: '' },
    { jobLogId: 3, jobName: '发送日报邮件', jobGroup: 'DEFAULT', invokeTarget: 'ryTask.sendDailyReport', jobMessage: '执行成功', status: '0', createTime: '2024-12-01 08:30:00', exceptionInfo: '' },
    { jobLogId: 4, jobName: '同步用户数据', jobGroup: 'DEFAULT', invokeTarget: 'ryTask.syncUser', jobMessage: '执行成功', status: '0', createTime: '2024-12-01 15:00:00', exceptionInfo: '' },
    { jobLogId: 5, jobName: '检查服务健康', jobGroup: 'DEFAULT', invokeTarget: 'ryTask.healthCheck', jobMessage: '执行成功', status: '0', createTime: '2024-12-01 15:05:00', exceptionInfo: '' },
    { jobLogId: 6, jobName: '生成统计报表', jobGroup: 'DEFAULT', invokeTarget: 'ryTask.genReport', jobMessage: '执行失败', status: '1', createTime: '2024-12-01 01:00:00', exceptionInfo: '数据库连接超时' },
    { jobLogId: 7, jobName: '清理日志文件', jobGroup: 'DEFAULT', invokeTarget: 'ryTask.cleanLog', jobMessage: '执行成功', status: '0', createTime: '2024-12-01 04:00:00', exceptionInfo: '' },
    { jobLogId: 8, jobName: '更新缓存数据', jobGroup: 'DEFAULT', invokeTarget: 'ryTask.updateCache', jobMessage: '执行成功', status: '0', createTime: '2024-12-01 15:10:00', exceptionInfo: '' },
    { jobLogId: 9, jobName: '备份配置文件', jobGroup: 'DEFAULT', invokeTarget: 'ryTask.backupConfig', jobMessage: '执行成功', status: '0', createTime: '2024-12-01 05:00:00', exceptionInfo: '' },
    { jobLogId: 10, jobName: '发送周报邮件', jobGroup: 'DEFAULT', invokeTarget: 'ryTask.sendWeeklyReport', jobMessage: '执行成功', status: '0', createTime: '2024-12-02 09:00:00', exceptionInfo: '' },
  ]
  return Promise.resolve({ code: 200, msg: "操作成功", rows: rows, total: rows.length })
}

export function getJobLog(jobLogId) {
  return Promise.resolve({ code: 200, msg: "操作成功", data: {} })
}

export function delJobLog(jobLogId) {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}

export function cleanJobLog() {
  return Promise.resolve({ code: 200, msg: "删除成功" })
}
