// @jsx h
import { value, compute, hook, if as _if, each } from 'rui'
import h from './h'

import Folder from './Folder'

import { dataTransfer2Folders, folders2SpineAnimation } from './utils'

function App() {
  const [folders, setFolders] = value([])
  const [fps, setFps] = value(24)
  const downloadString = compute(() => {
    const result = folders2SpineAnimation(folders(), fps())
    return `data:text/json,${result}`
  })

  const drop = evt => {
    dataTransfer2Folders(evt.dataTransfer)
      .then(newFolders => setFolders(folders().concat(newFolders)))
  }
  const remove = (folder) => {
    setFolders(folders().filter(f => f !== folder))
  }
  const clear = () => {
    setFolders([])
  }

  return <div className="app"
    ondragover={evt => evt.preventDefault()}
    ondrop={drop}
  >
    <label>FPS:</label>
    <input type="number" value={fps} oninput={({ target }) => setFps(parseInt(target.value))}/>
    <button type="button" onclick={clear}>清空</button>
    <a href={downloadString} download="animations.json">保存</a>
    <ul>
      {each(folders, (folder) => <Folder folder={folder} onRemove={() => remove(folder)}></Folder>)}
    </ul>
  </div>
}

const app = <App></App>
app.attach()
document.body.append(app.el)
