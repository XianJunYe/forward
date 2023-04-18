/**
 * 解析歌词字符串
 * 得到一个歌词对象数组
 * 每个歌词对象： {time: 开始时间， word: 歌词单句}
 * @param {String} lrc 歌词文件
 * @returns {words[]} 返回歌词对象数组
 */
function parseLrc(lrc) {
    const lines = lrc.split('\n')
    let result = [] //最终的歌词数组
    for (let i = 0; i < lines.length; i++) {
        const str = lines[i];
        const parts = str.split(']');
        const timeStr = parseTime(parts[0].substring(1));
        let obj = {
            time: timeStr,
            words: parts[1],
        };
        result.push(obj)
    }
    return result
}
/**
 * 将一个时间字符串解析为数字（秒）
 * @param {String} timeStr 时间字符串
 * @returns {number} 返回时间字符串对应的秒数
 */
function parseTime(timeStr) {
    const parts = timeStr.split(':');
    return +parts[0] * 60 + +parts[1]
}
/**
 * 根据当前播放进度找到对应的下标
 * @returns {number} 返回下标
 */
function findIndex() {
    const lrcs = parseLrc(lrc);
    const curTime = doms.audio.currentTime
    for (let i = 0; i < lrcs.length; i++) {
        if (curTime < lrcs[i].time) {
            return i - 1
        }
    }
    return lrcs.length - 1
}
/**
 * 根据得到的歌词对象数组，在界面生成对应的li
 */
function createElementLi() {
    let frag = document.createDocumentFragment(); // 文档片段
    for (let i = 0; i < lrcData.length; i++) {
        const li = document.createElement('li');
        li.textContent = lrcData[i].words;
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}
/**
 * 设置ul的偏移量
 */
function setOffset() {
    const index = findIndex();
    let offset = liHeight * index + liHeight / 2 - containerHeight / 2;
    if (offset < 0) {
        offset = 0;
    }
    if (offset > maxOffset) {
        offset = maxOffset;
    }
    doms.ul.style.transform = `translateY(-${offset}px)`;
    const liOld = doms.ul.querySelector('.active')
    if(liOld){
        liOld.classList.remove('active');
    }
    const li = doms.ul.children[index]
    if (li) {
        li.classList.add('active')
    }
}
// 一种思维，为了防止我们生成了太多的变量，可以将变量存放在对象里面。
const doms = {
    audio: document.querySelector("audio"),
    ul: document.querySelector(".container ul"),
    container: document.querySelector(".container"),
}
const lrcData = parseLrc(lrc)
createElementLi()
const containerHeight = doms.container.clientHeight;
const liHeight = doms.ul.children[0].clientHeight;
const maxOffset = doms.ul.clientHeight - containerHeight;
doms.audio.addEventListener('timeupdate',
    setOffset);

