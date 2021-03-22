import java.util.concurrent.*;
import javax.script.*;
import java.io.File;  // Import the File class
import java.io.FileNotFoundException;  // Import this class to handle errors
import java.util.Scanner; // Import the Scanner class to read text files
import org.graalvm.polyglot.*;
import org.graalvm.polyglot.proxy.*;

public class Graal
{
private static final int TIMEOUT_SEC = 1;
public static void main( final String ... args ) throws Exception
{
    final ScriptEngine engine = new ScriptEngineManager()
        .getEngineByName("JavaScript");

    File myObj = new File("/Users/shih-min.lee/Desktop/stop-example/hello.js");
    Scanner myReader = new Scanner(myObj);
    StringBuilder s = new StringBuilder();
    while (myReader.hasNextLine()) {
        String data = myReader.nextLine();
        s.append(data);
        s.append(";");
    }
    String script = s.toString();

    myReader.close();

    if ( args.length == 0 ) {
        execWithThread( engine, script );
    }
    else {
        execWithFuture( engine, script );
    }
}

private static void execWithThread(
    final ScriptEngine engine, final String script )
{
    final Runnable r = new Runnable() {
        public void run() {
            try {
                Context context = Context.create();
                Value jsBindings = context.getBindings("js");

                jsBindings.putMember("foo", 9);

                Value function = context.eval("js", script);
                int x = function.execute(jsBindings).asInt();

                System.out.println(x);
            }
            catch ( Exception e ) {
                System.out.println(
                    "Java: Caught exception from eval(): " + e.getMessage() );
            }
        }
    };
    System.out.println( "Java: Starting thread..." );
    final Thread t = new Thread( r );
    t.start();
    System.out.println( "Java: ...thread started" );
    try {
        Thread.currentThread().sleep( TIMEOUT_SEC * 1000 );
        if ( t.isAlive() ) {
            System.out.println( "Java: Thread alive after timeout, stopping..." );
            t.stop();
            System.out.println( "Java: ...thread stopped" );
        }
        else {
            System.out.println( "Java: Thread not alive after timeout." );
        }
    }
    catch ( InterruptedException e ) {
        System.out.println( "Interrupted while waiting for timeout to elapse." );
    }
}

private static void execWithFuture( final ScriptEngine engine, final String script )
    throws Exception
{
    final Callable<Object> c = new Callable<Object>() {
        public Object call() throws Exception {
            return engine.eval( script );
        }
    };
    System.out.println( "Java: Submitting script eval to thread pool..." );
    final Future<Object> f = Executors.newCachedThreadPool().submit( c );
    System.out.println( "Java: ...submitted." );
    try {
        final Object result = f.get( TIMEOUT_SEC, TimeUnit.SECONDS );
    }
    catch ( InterruptedException e ) {
        System.out.println( "Java: Interrupted while waiting for script..." );
    }
    catch ( ExecutionException e ) {
        System.out.println( "Java: Script threw exception: " + e.getMessage() );
    }
    catch ( TimeoutException e ) {
        System.out.println( "Java: Timeout! trying to future.cancel()..." );
        f.cancel( true );
        System.out.println( "Java: ...future.cancel() executed" );
    }
}
}