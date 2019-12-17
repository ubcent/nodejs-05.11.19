const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  //опис набор полей
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }

  //default -дефолтные значения
  //valid - ф-я валидации
  //require -обязат св-во или нет
});

//cоздать модель из схемы -метод model
//1 пар-р =наименование модели="Task"
//2 = наим. схемы =taskSchems
//3= н. коллекци ="tasks" -необяз. 
//Мангус получ автоматически из названия модели, но лучше указывать, чтобы избежать косяков
module.exports = mongoose.model("Task", taskSchema, "tasks");
