// no nest folder, only folder and folder/files.ext
// eg: [{ name: 'folder', files: ['001.png', '002.png'] }]
export async function dataTransfer2Folders(dataTransfer, re=/\.png$/) {
  const { items } = dataTransfer
  const entries = [...items]
    .map(item => item.webkitGetAsEntry())
    .filter(entry => entry && entry.isDirectory)

  return await Promise.all(entries.map(async entry => {
    const nestEntries = await new Promise(resolve => {
      entry.createReader().readEntries(resolve)
    })
    const files = nestEntries
      .filter(e => e.isFile)
      .map(e => e.name)
      .filter(name => re.test(name))
      .sort()

    return {
      name: entry.name,
      files,
    }
  }))
}


export function folders2SpineAnimation(folders, fps=24) {
  const frameTime = 1/fps

  const animations = folders.map(folder => {
    const { name: folderName, files } = folder
    const frames = files.map((name) => `${folderName}/${name}`)
    return [folderName, frames]
  })

  const spineAttachments = animations.flatMap(([, frames]) => frames)

  const result = {
    // skeleton: {
    //   // hash: 'qHZezg4uXjTt3CVHDK5gyN2FXrQ',
    //   // spine: '3.7.91',
    //   width: 34,
    //   height: 32,
    //   images: './images/',
    //   audio: '',
    // },
    bones: [{ name: 'root' }],
    slots: [{ name: 'seq', bone: 'root'/*, attachment: 'hit/01'*/ }],
    skins: {
      default: {
        // seq: {
        //   'hit/01': { width: 0, height: 0 },
        //   'hit/02': { width: 0, height: 0 },
        // },
        seq: Object.fromEntries(spineAttachments.map(key => [key, { width: 0, height: 0 }]))
      },
    },
    // animations: {
    //   hit: {
    //     slots: {
    //       seq: {
    //         attachment: [
    //           { time: 0, name: 'hit/02' },
    //           { time: 0.0667, name: 'hit/03' },
    //           { time: 0.1333, name: 'hit/03' }, // 需要重复最后一帧不然会直接loop到第一帧
    //         ],
    //       },
    //     },
    //   },
    // },
    animations: Object.fromEntries(animations.map(([key, frames]) => {
      return [key, {
        slots: {
          seq: {
            attachment: frames.concat(frames[frames.length-1]).map((name, i) => ({ name, time: parseFloat((i*frameTime).toFixed(4)) })),
          },
        },
      }]
    })),
  }

  return JSON.stringify(result)
}
