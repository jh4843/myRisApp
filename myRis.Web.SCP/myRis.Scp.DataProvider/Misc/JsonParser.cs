using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace myRis.Web.Scp.DataProvider.Misc
{
    public class JsonParser
    {
        public static string jsonFilePath = String.Empty;
        public static string jsonFileToSave = String.Empty;

        public JsonParser()
        {
            //
        }

        public static void CallingOpenFileDialog()
        {
            using (OpenFileDialog openFileDialog = new OpenFileDialog())
            {
                openFileDialog.InitialDirectory = @"D:\SVN\myRis.Web\myRis.Web.Scp"; //"c:\\";
                openFileDialog.Filter = "json files (*.json)|*.json";  //"txt files (*.txt)|*.txt|All files (*.*)|*.*";
                openFileDialog.Title = "Open Json File";
                openFileDialog.FilterIndex = 2;
                openFileDialog.RestoreDirectory = true;

                if (openFileDialog.ShowDialog() == DialogResult.OK)
                {
                    //Get the path of specified file
                    jsonFilePath = openFileDialog.FileName;
                }
            }
        }

        public static T ReadJson<T>()
        {
            string text = File.ReadAllText(jsonFilePath);
            T obj = JsonSerializer.Deserialize<T>(text);

            return obj;
        }

        public static void CallingSaveFileDialog()
        {
            using (SaveFileDialog saveFileDialog = new SaveFileDialog())
            {
                saveFileDialog.Filter = "json files (*.json)|*.json"; //|All files (*.*)|*.*";
                saveFileDialog.Title = "Save Json File";
                saveFileDialog.ShowDialog();

                // If the file name is not an empty string open it for saving.
                if (saveFileDialog.FileName != "")
                {
                    jsonFilePath = saveFileDialog.FileName;
                    File.WriteAllText(saveFileDialog.FileName, jsonFileToSave);
                }
            }
        }

        public static void WriteJson(Object obj)
        {
            jsonFileToSave = JsonSerializer.Serialize(obj, new JsonSerializerOptions() { WriteIndented = true });
        }
    }
}

// [Json Read Write Test]

//JsonParser.CallingOpenFileDialog();

//JsonParser.ReadJson<JsonData>();
//JsonParser.WriteJson(new JsonData() { ScpAETitle ="AAA", DicomListenerIP="10.0.0.1", DicomListenerPort=104, WebListenerPort=8080});

//JsonParser.CallingSaveFileDialog();
