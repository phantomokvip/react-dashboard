import { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

import { APIClient } from "../../helpers/api_helper";
import * as url from "../../helpers/url_helper";
import { typeFomartEditor } from "../../common/function";

const api = new APIClient();

export const UploadService = async (formData) => {
    try {
        const response = await api.create(
            `/api/upload/image`, formData)
        return response.data;
    } catch (error) {
        return error;
    }
}

function Editor({ onChange, value = "", refId }) {
    const quillRef = useRef(null);
    const imageHandler = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            let file = input && input.files ? input.files[0] : null;
            var formData = new FormData();
            formData.append('refId', refId.current);
            formData.append("image", file);
            let quillObj = quillRef.current.getEditor();
            await UploadService(formData)
                .then((res) => {
                    let data = `${process.env.REACT_APP_API_URL}${url.API_IMAGE_GET_BY_ID}/` + res.imageName;
                    const range = quillObj.getSelection();
                    quillObj.editor.insertEmbed(range.index, 'image', data);
                    onChange(quillObj.editor.scroll.domNode.innerHTML)
                })
                .catch((err) => {
                    console.log(err)
                    return false;
                });
        };
    }

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ size: [] }],
                    [{ font: [] }],
                    [{ align: ["right", "center", "justify"] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    [{ color: ["red", "#785412"] }],
                    [{ background: ["red", "#785412"] }]

                ]
                ,
                handlers: {
                    "image": imageHandler
                }
            }
        };
    }, [])
 
    return (
        <>
            <ReactQuill
                theme="snow"
                ref={quillRef}
                modules={modules}
                formats={typeFomartEditor}
                value={value}
                onChange={onChange}
            />
        </>
    );
}

export default Editor;