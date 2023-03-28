using myRis.Web.Scp.DataProvider.Misc;
using System;

namespace myRis.Web.Scp.Setting
{
    internal class Def
    {
        public enum OrderStatus
        {
            NONE = 0,
            ORDERED = 1,
            SCHEDULED,
            EXAMINED,
            MATCHED,
            //
            COMPLETED = 16,
            CANCELED = 32,
        }

        public static string GetOrderStatusMeaningToEnum(string inOrderStatus)
        {
            Logger.Instance.WriteLogDebug("Def", "GetOrderStatusMeaningToEnum", @"[START]");

            string outMeaning = string.Empty;

            try
            {
                if (true == string.IsNullOrEmpty(inOrderStatus))
                {
                    return outMeaning;
                }

                _ = int.TryParse(inOrderStatus, out int orderStatus);

                switch ((OrderStatus)orderStatus)
                {
                    case OrderStatus.ORDERED:
                        {
                            outMeaning = "Ordered";
                        }
                        break;
                    case OrderStatus.SCHEDULED:
                        {
                            outMeaning = "Scheduled";
                        }
                        break;
                    case OrderStatus.EXAMINED:
                        {
                            outMeaning = "Examined";
                        }
                        break;
                    case OrderStatus.MATCHED:
                        {
                            outMeaning = "Matched";
                        }
                        break;
                    case OrderStatus.COMPLETED:
                        {
                            outMeaning = "Completed";
                        }
                        break;
                    case OrderStatus.CANCELED:
                        {
                            outMeaning = "Canceled";
                        }
                        break;
                    default:
                        {
                            outMeaning = String.Empty;
                        }
                        break;
                }
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("Def", "GetOrderStatusMeaningToEnum", ex.Message);
            }

            Logger.Instance.WriteLogDebug("Def", "GetOrderStatusMeaningToEnum", @"[END]");

            return outMeaning;
        }

        public static OrderStatus GetOrderStatusEnumToMeaning(string inOrderStatus)
        {
            Logger.Instance.WriteLogDebug("Def", "GetOrderStatusEnumToMeaning", @"[START]");

            OrderStatus outOrderStatus = OrderStatus.NONE;

            try
            {
                switch (inOrderStatus)
                {
                    case nameof(OrderStatus.ORDERED):
                        {
                            outOrderStatus = OrderStatus.ORDERED;
                        }
                        break;
                    case nameof(OrderStatus.SCHEDULED):
                        {
                            outOrderStatus = OrderStatus.SCHEDULED;
                        }
                        break;
                    case nameof(OrderStatus.EXAMINED):
                        {
                            outOrderStatus = OrderStatus.EXAMINED;
                        }
                        break;
                    case nameof(OrderStatus.MATCHED):
                        {
                            outOrderStatus = OrderStatus.MATCHED;
                        }
                        break;
                    case nameof(OrderStatus.COMPLETED):
                        {
                            outOrderStatus = OrderStatus.COMPLETED;
                        }
                        break;
                    case nameof(OrderStatus.CANCELED):
                        {
                            outOrderStatus = OrderStatus.CANCELED;
                        }
                        break;
                    default:
                        {
                            outOrderStatus = OrderStatus.NONE;
                        }
                        break;
                }
            }
            catch (Exception ex)
            {
                Logger.Instance.WriteLogError("Def", "GetOrderStatusEnumToMeaning", ex.Message);
            }

            Logger.Instance.WriteLogDebug("Def", "GetOrderStatusEnumToMeaning", @"[END]");

            return outOrderStatus;
        }
    }
}