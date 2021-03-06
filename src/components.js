/** common components */
import vIcon from "./components/common/vIcons"; /* Icons */
import btnSwitch from "./components/common/btnSwitch"; /* btnSwitch 按钮 */
import badge from "./components/common/badge"; /* Badge 徽标 */
import CommonHeader from "./components/common/CommonHeader.vue"; /* 通用头部 */
import fullSpin from "./components/FullSpin"; /* 全屏加载动画 */
import loadMore from "./components/loadMore";
import HeadTop from "./components/HeadTop";
import FootGuide from "./components/FootGuide";
import DiySelect from "./components/DiySelect";
import AsyncFile from "./components/common/AsyncFile";
import JoLoadMore from "@/components/JoLoadMore.vue";
import Avatar from "@/components/Avatar.vue";
import NavTabs from "@/components/tabs/NavTabs.vue";

import FormItems from "@/components/form/formItem.js";

export default [
  Avatar,
  vIcon,
  btnSwitch,
  badge,
  loadMore,
  fullSpin,
  HeadTop,
  FootGuide,
  DiySelect,
  NavTabs,
  AsyncFile,
  JoLoadMore,
  CommonHeader,

  ...FormItems
];
