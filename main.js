const{app,BrowserWindow,ipcMain}=require('electron');
const path=require('path');
let win 

function createWindow(){
  win=new BrowserWindow({
  width:800,
  height:600,
  webPreferences:{
   nodeIntegration:true,
  contextIsolation:false,
    }
  });
}

win.loadURL('http://localhost:3001')

app.whenReady().then(createWindow);
app.on('activate',()=>{
  if(BrowserWindow.getAllWindows().length===0){
   createWindow();
  }
});

app.on('window-all-closed',()=>{
  if(process.platform!=='darwin'){
  app.quit();
  }
});