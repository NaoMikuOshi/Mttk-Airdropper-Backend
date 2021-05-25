import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
require('dotenv').config();

@Injectable()
export class NotificationService {
  /**
   * 推送到钉钉机器人 pushToDingTalk
   * @param botName 机器人名字
   * @param msgtype 消息类型
   * @param params 其他参数，详情参考钉钉开发文档 https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq
   * @param atMobiles at 谁（的手机号码），**必须是 string 而不是数字**
   * @param isAtAll 是否 at 整个群，可选项，默认为 false
   */
  pushToDingTalk(
    msgtype: string,
    params: Record<string, any>,
    atMobiles: string[],
    isAtAll = false,
  ): Promise<AxiosResponse> {
    const access_token = process.env.DINGTALK_TOKEN;
    if (!access_token)
      throw new Error("You don't have such a dingtalk bot in config.");
    return axios.post(
      'https://oapi.dingtalk.com/robot/send',
      {
        msgtype,
        ...params,
        at: {
          atMobiles,
          isAtAll,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        params: { access_token },
      },
    );
  }

  async pushTextToDingTalk(
    content: string,
    atMobiles = [],
    isAtAll = false,
  ): Promise<void> {
    await this.pushToDingTalk(
      'text',
      { text: { content } },
      atMobiles,
      isAtAll,
    );
  }

  async pushMarkdownToDingtalk(
    title: string,
    text: string,
    atMobiles = [],
    isAtAll = false,
  ): Promise<void> {
    await this.pushToDingTalk(
      'markdown',
      { markdown: { title, text } },
      atMobiles,
      isAtAll,
    );
  }
}
