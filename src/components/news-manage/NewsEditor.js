import React, { useEffect, useState } from 'react'
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState("")

    useEffect(() => {
      // html ===> draft
      const html = props.content
        if(html === undefined){
          return;
        }else{
          const contentBlock = htmlToDraft(html);
          if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              const editorState = EditorState.createWithContent(contentState);
              setEditorState(editorState)
          }
        }
    }, [props.content])

  return (
    <div>
      <Editor
          // 配合onEditorStateChange变为可控组件   
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={(editorState)=>setEditorState(editorState)}
          // 失去焦点时执行
          onBlur={()=>{
            // 把 draft ===> html格式
            props.getContent( draftToHtml(convertToRaw(editorState.getCurrentContent())) )
            
          }}
        />
    </div>
  )
}