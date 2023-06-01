import News from "../../../models/newsModel.js";

const getNews = async()=>await News.find({});
const getNewsById=async(id)=>  await News.findById({_id:id});

export  {getNews,getNewsById}