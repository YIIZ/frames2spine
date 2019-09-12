// @jsx h
import { value, compute, hook, each } from 'rui'
import h from './h'

export default function ({ folder, onRemove }) {
  return <li>
    <span>{folder.name}</span>
    <span>帧数:{folder.files.length}</span>
    <button type="button" onclick={onRemove}>删除</button>
  </li>
}
