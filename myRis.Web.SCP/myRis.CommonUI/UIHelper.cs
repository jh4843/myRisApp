using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Media;
using System.Windows.Threading;

namespace myRis.Web.Scp.CommonUI
{
    public static class UIHelper
    {
        /// <summary>
        /// Visual Parent를 <Type>으로 찾기
        /// </summary>
        public static T FindVisualParent<T>(DependencyObject child)
            where T : DependencyObject
        {
            if (child == null) return null;

            DependencyObject parentObject = VisualTreeHelper.GetParent(child);

            if (parentObject == null) return null;

            T parent = parentObject as T;
            if (parent != null)
                return parent;
            else
                return FindVisualParent<T>(parentObject);
        }

        /// <summary>
        /// Control 안 Child를 Type으로 뽑아낸다. 주로 ListControl의 ScrollViewer를 찾을 때
        /// </summary>
        public static Visual GetDescendantByType(Visual element, Type type)
        {
            // http://social.msdn.microsoft.com/Forums/en-US/wpf/thread/b1f9635f-2bc9-46e4-82fe-61d072048ca3
            if (element == null) return null;
            if (element.GetType() == type) return element;
            Visual foundElement = null;
            if (element is FrameworkElement)
            {
                (element as FrameworkElement).ApplyTemplate();
            }
            for (int i = 0; i < VisualTreeHelper.GetChildrenCount(element); i++)
            {
                Visual visual = VisualTreeHelper.GetChild(element, i) as Visual;
                foundElement = GetDescendantByType(visual, type);
                if (foundElement != null)
                    break;
            }
            return foundElement;
        }

        /// <summary>
        /// Control 안 Visual Child를 찾는다.
        /// </summary>
        public static childItem FindVisualChild<childItem>(DependencyObject obj)
            where childItem : DependencyObject
        {
            // http://msdn.microsoft.com/en-us/library/system.windows.frameworktemplate.findname.aspx
            for (int i = 0; i < VisualTreeHelper.GetChildrenCount(obj); i++)
            {
                DependencyObject child = VisualTreeHelper.GetChild(obj, i);
                if (child != null && child is childItem)
                    return (childItem)child;
                else
                {
                    childItem childOfChild = FindVisualChild<childItem>(child);
                    if (childOfChild != null)
                        return childOfChild;
                }
            }
            return null;
        }

        /// <summary>
        /// Control 안 Visual Child를 모두 찾는다.
        /// </summary>
        public static IEnumerable<T> FindVisualChildren<T>(DependencyObject depObj) where T : DependencyObject
        {
            // http://stackoverflow.com/questions/974598/find-all-controls-in-wpf-window-by-type
            if (depObj != null)
            {
                for (int i = 0; i < VisualTreeHelper.GetChildrenCount(depObj); i++)
                {
                    DependencyObject child = VisualTreeHelper.GetChild(depObj, i);
                    if (child != null && child is T)
                    {
                        yield return (T)child;
                    }

                    foreach (T childOfChild in FindVisualChildren<T>(child))
                    {
                        yield return childOfChild;
                    }
                }
            }
        }

        /// <summary>
        /// Raises this object's PropertyChanged event.
        /// 어플리케이션 전반에서 쓰는 아이라 static 으로 뺌.
        /// </summary>
        public static void OnPropertyChanged(object sender, string propertyName, PropertyChangedEventHandler propertyChanged)
        {
#if DEBUG
            string msg = string.Format("*OnPropertyChanged* {0}.{1} ({2})", sender.GetType().Namespace, sender.GetType().Name, propertyName);
            System.Diagnostics.Debug.WriteLine(msg);
#endif
            if (propertyChanged != null)
                propertyChanged(sender, new PropertyChangedEventArgs(propertyName));
        }

        /// <summary>
        /// Culture Setting Function
        /// </summary>
        public static void SetCultureInfo(string strCulture)
        {
            System.Threading.Thread.CurrentThread.CurrentCulture =
            System.Threading.Thread.CurrentThread.CurrentUICulture =
                new System.Globalization.CultureInfo(strCulture);

            FrameworkElement.LanguageProperty.OverrideMetadata(
                typeof(FrameworkElement),
                new FrameworkPropertyMetadata(System.Windows.Markup.XmlLanguage.GetLanguage(System.Globalization.CultureInfo.CurrentCulture.IetfLanguageTag))
                );
        }

        /// <summary>
        /// Accessing data inside a template 
        /// </summary>
        /// <param name="currentItem"></param>
        /// <param name="controlTypeOfDataToFind"></param>
        /// <param name="nameOfDataToFind"></param>
        /// <returns></returns>
        public static UIElement GetDataTemplateItemOf(UIElement currentItem, string nameOfDataToFind)
        {
            if (currentItem is ListBoxItem)
            {
                ListBoxItem myListBoxItem = currentItem as ListBoxItem;
                ContentPresenter myContentPresenter = UIHelper.FindVisualChild<ContentPresenter>(myListBoxItem);
                DataTemplate myDataTemplate = myContentPresenter.ContentTemplate;

                UIElement dataFound = (UIElement)myDataTemplate.FindName(nameOfDataToFind, myContentPresenter);
                return dataFound;
            }
            else if (currentItem is ListViewItem)
            {
                ListViewItem myListViewItem = currentItem as ListViewItem;
                ContentPresenter myContentPresenter = UIHelper.FindVisualChild<ContentPresenter>(myListViewItem);
                DataTemplate myDataTemplate = myContentPresenter.ContentTemplate;

                UIElement dataFound = (UIElement)myDataTemplate.FindName(nameOfDataToFind, myContentPresenter);
                return dataFound;
            }
            return null;
        }
    }

    //List 스타일에서 아이템이 가운데 오기
    //http://stackoverflow.com/questions/2946954/make-listview-scrollintoview-scroll-the-item-into-the-center-of-the-listview-c
    public static class ItemsControlExtensions
    {
        public static void ScrollToCenterOfView(this ItemsControl itemsControl, object item)
        {
            // Scroll immediately if possible    
            if (!itemsControl.TryScrollToCenterOfView(item))
            {
                // Otherwise wait until everything is loaded, then scroll    
                if (itemsControl is ListBox) ((ListBox)itemsControl).ScrollIntoView(item);
                itemsControl.Dispatcher.BeginInvoke(DispatcherPriority.Loaded, new Action(() =>
                { itemsControl.TryScrollToCenterOfView(item); }));
            }
        }
        private static bool TryScrollToCenterOfView(this ItemsControl itemsControl, object item)
        {
            // Find the container  
            var container = itemsControl.ItemContainerGenerator.ContainerFromItem(item) as UIElement;
            if (container == null) return false;
            // Find the ScrollContentPresenter    
            ScrollContentPresenter presenter = null;
            for (Visual vis = container; vis != null && vis != itemsControl; vis = VisualTreeHelper.GetParent(vis) as Visual)
                if ((presenter = vis as ScrollContentPresenter) != null)
                    break;
            if (presenter == null) return false;
            // Find the IScrollInfo   
            var scrollInfo =
                !presenter.CanContentScroll ? presenter :
                presenter.Content as IScrollInfo ??
                FirstVisualChild(presenter.Content as ItemsPresenter) as IScrollInfo ??
                presenter;
            // Compute the center point of the container relative to the scrollInfo    
            Size size = container.RenderSize;
            Point center = container.TransformToAncestor((Visual)scrollInfo).Transform(new Point(size.Width / 2, size.Height / 2));
            center.Y += scrollInfo.VerticalOffset;
            //center.X += scrollInfo.HorizontalOffset;

            // Adjust for logical scrolling     
            if (scrollInfo is StackPanel || scrollInfo is VirtualizingStackPanel)
            {
                double logicalCenter = itemsControl.ItemContainerGenerator.IndexFromContainer(container) + 0.5;
                Orientation orientation = scrollInfo is StackPanel ? ((StackPanel)scrollInfo).Orientation : ((VirtualizingStackPanel)scrollInfo).Orientation;
                if (orientation == Orientation.Horizontal)
                    center.X = logicalCenter;
                else center.Y = logicalCenter;
            }
            // Scroll the center of the container to the center of the viewport    
            if (scrollInfo.CanVerticallyScroll) scrollInfo.SetVerticalOffset(CenteringOffset(center.Y, scrollInfo.ViewportHeight, scrollInfo.ExtentHeight));
            //  if (scrollInfo.CanHorizontallyScroll) scrollInfo.SetHorizontalOffset(CenteringOffset(center.X, scrollInfo.ViewportWidth, scrollInfo.ExtentWidth));
            return true;
        }
        private static double CenteringOffset(double center, double viewport, double extent)
        {
            return Math.Min(extent - viewport, Math.Max(0, center - viewport / 2));
        }
        private static DependencyObject FirstVisualChild(Visual visual)
        {
            if (visual == null) return null;
            if (VisualTreeHelper.GetChildrenCount(visual) == 0) return null;
            return VisualTreeHelper.GetChild(visual, 0);
        }
    }
}
