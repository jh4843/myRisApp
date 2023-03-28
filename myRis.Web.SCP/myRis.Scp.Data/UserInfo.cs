using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Data
{
    public class UserInfo
    {
        //[JsonPropertyName("user_Key")]
        //public int UserKey  { get; set; }

        //[JsonPropertyName("user_level")]
        //public string UserLevel { get; set; }

        //[JsonPropertyName("user_id")]
        //public string UserId { get; set; }

        //[JsonPropertyName("user_pwd")]
        //public string UserPwd { get; set; }

        //[JsonPropertyName("user_name")]
        //public string UserName { get; set; }

        //[JsonPropertyName("user_desc")]
        //public string UserDesc { get; set; }

        //[JsonPropertyName("user_create_dttm")]
        //public DateTime UserCreateDttm { get; set; }

        //.Net 5.0 에서 JsonPropertyName을 지원하면 Property Name Alias가 가능한데...  (like above) 현재는 db variable 값이랑 맞춰야 해서 Nameing Rule에 안맞음.
        public int user_key { get; set; }

        public string user_level { get; set; }

        public string user_id { get; set; }

        public string user_pwd { get; set; }

        public string user_name { get; set; }

        public string user_desc { get; set; }

        public DateTime user_create_dttm { get; set; }
    }
}