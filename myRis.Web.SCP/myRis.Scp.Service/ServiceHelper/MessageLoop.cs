using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace myRis.Web.Scp.Service.ServiceHelper
{
    // Reference:
    // https://www.sysnet.pe.kr/2/0/12139
    // https://stackoverflow.com/questions/2222365/what-is-a-message-pump
    // https://www.leadtools.com/support/forum/posts/t3013-LDicomNet-callbacks-are-not-triggered
    public class MessageLoop : IDisposable
    {
        uint _tid;
        EventWaitHandle _ewh_Sync = new EventWaitHandle(true, EventResetMode.ManualReset);
        EventWaitHandle _ewh_Exit = new EventWaitHandle(true, EventResetMode.ManualReset);

        public ApartmentState COMApartment => _uiThread.GetApartmentState();

        public void PostMessage(Win32Message msg)
        {
            PostMessage((uint)msg);
        }

        bool _disposed;

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed == false)
            {
                if (disposing == true)
                {
                    SendMessage(Win32Message.WM_CLOSE);
                    _ewh_Exit.WaitOne();
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void PostMessage(uint msg)
        {
            if (_tid == 0)
            {
                return;
            }

            NativeMethods.PostThreadMessage(_tid, msg, UIntPtr.Zero, IntPtr.Zero);
        }

        public void WaitForExit(int millisecondsTimeout = Timeout.Infinite)
        {
            _ewh_Exit.WaitOne(millisecondsTimeout);
        }

        public void SendMessage(Win32Message msg)
        {
            SendMessage((uint)msg);
        }

        public void SendMessage(uint msg)
        {
            if (_tid == 0)
            {
                return;
            }

            _ewh_Sync.Reset();
            NativeMethods.PostThreadMessage(_tid, msg, UIntPtr.Zero, IntPtr.Zero);
            _ewh_Sync.WaitOne();
        }

        Thread _uiThread;
        bool _useBackgroundThread;
        ApartmentState _apartment;

        public MessageLoop() : this(true, ApartmentState.STA) { }

        public MessageLoop(bool useBackgroundThread) : this(useBackgroundThread, ApartmentState.STA) { }

        public MessageLoop(bool useBackgroundThread, ApartmentState apartment)
        {
            _useBackgroundThread = useBackgroundThread;
            _apartment = apartment;
        }

        public void Run()
        {
            _ewh_Exit.Set();

            _uiThread = new Thread(Start);
            _uiThread.SetApartmentState(_apartment);
            _uiThread.IsBackground = _useBackgroundThread;
            _uiThread.Start();
        }

        public event EventHandler Loaded;
        public event EventHandler Closed;
        public event EventHandler<MessageEventArgs> MessageArrived;

        protected virtual void OnLoad() { }

        protected virtual void OnClose() { }

        protected virtual void WindowProc(MSG msg) { }

        void Start()
        {
            _tid = NativeMethods.GetCurrentThreadId();

            OnLoad();

            // null condition operator indicating that this code will not throw a NullReferenceException exception if handler is null
            //if(Loaded != null)
            //{
            //    Loaded.Invoke(this, EventArgs.Empty);
            //}
            Loaded?.Invoke(this, EventArgs.Empty);

            try
            {
                while (true)
                {
                    int ret = NativeMethods.GetMessage(out MSG msg, IntPtr.Zero, 0, 0);
                    if (ret == 0 || ret == -1)
                    {
                        break;
                    }

                    try
                    {
                        WindowProc(msg);
                        MessageArrived?.Invoke(this, new MessageEventArgs(msg));

                        switch (msg.message)
                        {
                            case (uint)Win32Message.WM_CLOSE:
                                OnClose();
                                Closed?.Invoke(this, EventArgs.Empty);
                                return;
                        }

                        NativeMethods.TranslateMessage(ref msg);
                        NativeMethods.DispatchMessage(ref msg);
                    }
                    finally
                    {
                        _ewh_Sync.Set();
                    }
                }
            }
            finally
            {
                _disposed = true;
                _tid = 0;
                _ewh_Exit.Set();
            }
        }
    }
}