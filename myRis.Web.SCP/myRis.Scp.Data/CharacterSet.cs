namespace myRis.Web.Scp.Data
{
    public class CharacterSet
    {
        public string IsoRegistrationNumber { get; set; }

        public string Description { get; set; }

        public string DisplayCharacterSet
        {
            get { return string.Format(@"{0}({1})", IsoRegistrationNumber, Description); }
        }
    }
}