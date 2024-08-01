import axios from "axios";
import FormData from "form-data";
import fs, { chownSync } from "fs";

interface IScene {
  time: string,
  description: string
}
// remove temp file after processing
const removeTempFile = (videoPath: string) => {
  fs.unlink(videoPath, (err) => {
    if (err) {
      throw err
    }
  });
}

export const makeScenes = async (videoPath: string): Promise<IScene[]> => {
  try {
    const data = new FormData();
    data.append("video", fs.createReadStream(videoPath));
    data.append("instruction", process.env.ROE_VID_INSTRUCTIONS);

    const config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: process.env.ROE_VID_AGENT_URL,
      headers: {
        Authorization: process.env.ROE_AI_API_TOKEN,
        ...data.getHeaders(),
      },
      data: data,
    };

    const response = await axios.request(config);

    if (axios.isAxiosError(response)) {
      throw new Error(response.statusText);
    }
    const [responseData] = response.data;
    const { scenes }: { scenes: IScene[] } = JSON.parse(responseData.value);

    return scenes;
  } catch (error) {
    throw error;
  } finally {
    removeTempFile(videoPath);
  }
}


export const searchScenes = async (scenes: IScene[], instruction: string) => {
  try {
    const formdata = new FormData();
    formdata.append("instruction", instruction);
    formdata.append("text", JSON.stringify(scenes));
    formdata.append("model", process.env.ROE_VID_SEARCH_MODEL);

    const config = {
      method: "POST",
      url: process.env.ROE_TEXT_AGENT_URL,
      headers: {
        Authorization: process.env.ROE_AI_API_TOKEN,
        ...formdata.getHeaders(),
      }, 
      data: formdata,
    };

    const { data } = await axios.request(config);
    const [responseData] = data;
    const { matchedScene } = JSON.parse(responseData.value)
    return matchedScene;
  } catch (error) {
    throw error
  }
}


