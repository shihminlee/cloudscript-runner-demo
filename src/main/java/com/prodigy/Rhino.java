package com.prodigy;

import java.util.concurrent.*;
import io.javalin.Javalin;
import io.javalin.apibuilder.ApiBuilder.*;
// import org.mozilla.javascript.*;
// import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import java.io.File;  // Import the File class
import java.io.FileNotFoundException;  // Import this class to handle errors
import java.util.Scanner; // Import the Scanner class to read text files

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import static io.javalin.apibuilder.ApiBuilder.path;


public class Rhino {
    private static final int TIMEOUT_SEC = 1;
    static String getCode(String filename) {
        try {
            File obj = new File(filename);
            Scanner reader = new Scanner(obj);
            StringBuilder s = new StringBuilder();
            while (reader.hasNextLine()) {
                String data = reader.nextLine();
                s.append(data);
            }
            return s.toString();
        } catch (FileNotFoundException e) {
            return "";
        }
    }

    public static void main(String[] args) {
        Javalin app = Javalin.create(config -> {
            config.asyncRequestTimeout = 1000L;
        }).start(7000);
        app.get("/executeScript/:key", ctx -> ctx.result(RunScript(ctx.pathParam("key"))));
    }

    public static String RunScriptWithThread() throws Exception {
        execWithFuture( );
        return "true";
    }


    private static void execWithFuture( ) throws Exception
    {
        final Callable<Object> c = new Callable<Object>() {
            public Object call() throws Exception {
                return RunScript("");
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

    public static String RunScript(String type) {
        String code = getCode("./scripts/rhino/" + type + ".js");

        Storage storage = new Storage();

        MyFactory f = new MyFactory();
        Context rhino = f.enter();
        rhino.setOptimizationLevel(-1);

        Object[] functionParams = new Object[] {"Other parameters", storage};
        try
        {
            Scriptable scope = rhino.initStandardObjects();

            rhino.evaluateString(scope, code, "TestJavaScript", 1, null);
            Function jsFunction = (Function) scope.get("jsFunction", scope);
            Object jsResult = jsFunction.call(rhino, scope, scope, functionParams);
            String result = Context.toString(jsResult);
            return result;
        }
        catch(Exception e) {
            e.printStackTrace();
        } finally {
            Context.exit();
        }

        return "Error";
    }
}

