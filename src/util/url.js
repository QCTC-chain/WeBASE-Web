/*
 * @Author: yyzhangyang zy871029@126.com
 * @Date: 2023-09-14 10:54:38
 * @LastEditors: yyzhangyang zy871029@126.com
 * @LastEditTime: 2023-09-20 09:35:42
 * @FilePath: /WeBASE-Web/src/util/url.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * Copyright 2014-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*mgr*/
let mgr = process.env.MGR_PATH;
export default {
    ORG_LIST: `${mgr}/node-mgr`,
    // codeUrl: `${mgr}/webase-node-mgr`
    HOST_URL: `${mgr}/host-mgr`
}
